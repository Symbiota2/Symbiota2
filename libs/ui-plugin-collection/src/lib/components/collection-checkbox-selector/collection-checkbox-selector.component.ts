import {
    Component,
    EventEmitter,
    Input,
    Injectable,
    Output, OnChanges, SimpleChanges, OnInit, ChangeDetectorRef
} from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { CollectionListItem } from '../../dto/Collection.output.dto';
import { CollectionCategory } from '../../dto/Category.output.dto';
import { filter, map } from 'rxjs/operators';

const ROOT_NODE_ID = 65536;

class TreeNode {
    id: number;
    name: string;
    icon: string;
    children: TreeNode[];

    constructor(id: number, icon: string) {
        this.id = id;
        this.name = '';
        this.icon = icon;
        this.children = [];
    }

    hasChildren(): boolean {
        return this.children.length > 0;
    }

    isRootNode(): boolean {
        return this.id === ROOT_NODE_ID;
    }

    getChildIDs(): number[] {
        return this.children.map((child) => child.id);
    }
}

@Injectable()
export class CollectionTreeData {
    public data = this.collectionService.categories.pipe(
        map((categories) => {
            const rootNode = new TreeNode(ROOT_NODE_ID, '');

            categories.forEach((category) => {
                rootNode.children.push(this.buildTreeData(category));
            });

            return [rootNode];
        })
    );

    constructor(private collectionService: CollectionService) { }

    buildTreeData(currentNode: CollectionListItem | CollectionCategory): TreeNode {
        const newNode = new TreeNode(
            currentNode.id,
            currentNode.icon
        );

        if ('category' in currentNode) {
            const category = currentNode as CollectionCategory;
            newNode.name = category.category;

            category.collections.forEach((collection) => {
                newNode.children.push(this.buildTreeData(collection));
            });
        }
        else {
            newNode.name = currentNode.collectionName;
        }

        return newNode;
    }
}

@Component({
    selector: 'symbiota2-collection-checkbox-selector',
    templateUrl: './collection-checkbox-selector.component.html',
    styleUrls: ['./collection-checkbox-selector.component.scss'],
    providers: [CollectionTreeData]
})
export class CollectionCheckboxSelectorComponent implements OnChanges, OnInit {
    @Input() collectionIDs: number[];
    @Input() selectAll = false;
    @Output() collectionIDsChange = new EventEmitter<number[]>();

    public treeControl = new NestedTreeControl<TreeNode>(node => node.children);
    public dataSource = new MatTreeNestedDataSource<TreeNode>();

    public collectionSelections = new SelectionModel<number>(true);

    constructor(private treeDataManager: CollectionTreeData) { }

    ngOnInit() {
        this.treeDataManager.data.subscribe((treeNodes) => {
            this.dataSource.data = treeNodes;

            const rootNode = this.dataSource.data[0];
            this.treeControl.expand(rootNode);

            if (this.selectAll && this.collectionIDs.length === 0) {
                const selectedIDs = [];
                rootNode.children.forEach((category) => {
                    const collectionIDs = category.getChildIDs();
                    selectedIDs.push(...collectionIDs);
                });
                this.collectionIDsChange.emit(selectedIDs);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.collectionIDs) {
            this.collectionSelections.clear();
            this.collectionSelections.select(...changes.collectionIDs.currentValue);
        }
    }

    nodeHasChildren(_: number, node: TreeNode) {
        return node.hasChildren();
    }

    nodeSomeChildrenSelected(node: TreeNode, initialValue = false): boolean {
        const currentSelections = this.collectionSelections.selected;

        if (initialValue) {
            return true;
        }

        if (this.nodeAllChildrenSelected(node)) {
            return false;
        }

        return node.children.reduce<boolean>((someSelected, currentNode) => {
            if (currentNode.hasChildren()) {
                return this.nodeSomeChildrenSelected(currentNode, someSelected);
            }

            return someSelected || currentSelections.includes(currentNode.id);

        }, initialValue);
    }

    nodeAllChildrenSelected(node: TreeNode, initialValue = true): boolean {
        const currentSelections = this.collectionSelections.selected;

        if (initialValue) {
            return node.children.reduce<boolean>((allSelected, currentNode) => {
                if (currentNode.hasChildren()) {
                    return this.nodeAllChildrenSelected(currentNode, allSelected);
                }

                return allSelected && currentSelections.includes(currentNode.id);

            }, initialValue);
        }

        return false;
    }

    toggleCollection(checkbox: MatCheckbox, collectionID: number) {
        if (checkbox.checked) {
            this.collectionSelections.select(collectionID);
        }
        else {
            this.collectionSelections.deselect(collectionID);
        }

        this.collectionIDsChange.emit(this.collectionSelections.selected);
    }

    // So we can finish all recursive updates before emitting an event
    toggleCategory(checkbox: MatCheckbox, node: TreeNode) {
        this._toggleCategory(checkbox, node);
        this.collectionIDsChange.emit(this.collectionSelections.selected);
    }

    private _toggleCategory(checkbox: MatCheckbox, node: TreeNode) {
        if (node.isRootNode()) {
            node.children.forEach((categoryNode) => {
                this._toggleCategory(checkbox, categoryNode);
            });
        }
        else {
            const childIDs = node.getChildIDs();

            if (checkbox.checked) {
                this.collectionSelections.select(...childIDs);
            }
            else {
                this.collectionSelections.deselect(...childIDs);
            }
        }
    }
}
