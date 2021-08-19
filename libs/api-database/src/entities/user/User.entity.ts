import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { ActionRequest } from '../action-request/ActionRequest.entity';
import { AdminStat } from '../AdminStat.entity';
import { Checklist } from '../checklist/Checklist.entity';
import { ChecklistTaxonComment } from '../checklist/ChecklistTaxonComment.entity';
import { CollectionContact } from '../collection/CollectionContact.entity';
import { CrowdSourceQueue } from '../crowd-source/CrowdSourceQueue.entity';
import { EntityProvider } from '../../entity-provider.class';
import { Glossary } from '../glossary/Glossary.entity';
import { GlossaryImage } from '../glossary/GlossaryImage.entity';
import { Image } from '../image/Image.entity';
import { ImageKeyword } from '../image/ImageKeyword.entity';
import { Institution } from '../collection/Institution.entity';
import { Medium } from '../Medium.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { OccurrenceAssociation } from '../occurrence/OccurrenceAssociation.entity';
import { OccurrenceComment } from '../occurrence/OccurrenceComment.entity';
import { OccurrenceEdit } from '../occurrence/OccurrenceEdit.entity';
import { OccurrenceRevision } from '../occurrence/OccurrenceRevision.entity';
import { OccurrenceVerification } from '../occurrence/OccurrenceVerification.entity';
import { OccurrenceDataset } from '../occurrence/OccurrenceDataset.entity';
import { RefreshToken } from './RefreshToken.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { TaxonDescriptionBlock } from '../taxonomy/TaxonDescriptionBlock.entity';
import { TaxonProfilePublication } from '../taxonomy/TaxonProfilePublication.entity';
import { UserTaxonomy } from '../taxonomy/UserTaxonomy.entity';
import { Trait } from '../trait/Trait.entity';
import { TraitState } from '../trait/TraitState.entity';
import { TraitAttribute } from '../trait/TraitAttribute.entity';
import { Unknown } from '../unknown-taxon/Unknown.entity';
import { UserAccessToken } from './UserAccessToken.entity';
import { UserRole } from './UserRole.entity';
import { UserNotification } from './UserNotification.entity';

@Index('Index_email', ['email', 'lastName'], { unique: true })
@Index('Index_username_password', ['username', 'password'])
@Entity('users')
export class User extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'uid', unsigned: true })
    uid: number;

    @Column('varchar', { name: 'username', length: 45, unique: true })
    username: string;

    @Exclude()
    @Column('varchar', { name: 'password' })
    password: string;

    @Column('varchar', { name: 'firstname', nullable: true, length: 45 })
    firstName: string | null;

    @Column('varchar', { name: 'lastname', length: 45 })
    lastName: string;

    @Column('varchar', { name: 'title', nullable: true, length: 150 })
    title: string | null;

    @Column('varchar', { name: 'institution', nullable: true, length: 200 })
    institution: string | null;

    @Column('varchar', { name: 'department', nullable: true, length: 200 })
    department: string | null;

    @Column('varchar', { name: 'address', nullable: true, length: 255 })
    address: string | null;

    @Column('varchar', { name: 'city', nullable: true, length: 100 })
    city: string | null;

    @Column('varchar', { name: 'state', nullable: true, length: 50 })
    state: string | null;

    @Column('varchar', { name: 'zip', nullable: true, length: 15 })
    zip: string | null;

    @Column('varchar', { name: 'country', nullable: true, length: 50 })
    country: string | null;

    @Column('varchar', { name: 'phone', nullable: true, length: 45 })
    phone: string | null;

    @Column('varchar', { name: 'email', length: 100 })
    email: string;

    @Column('varchar', { name: 'RegionOfInterest', nullable: true, length: 45 })
    regionOfInterest: string | null;

    @Column('varchar', { name: 'url', nullable: true, length: 400 })
    url: string | null;

    @Column('varchar', { name: 'Biography', nullable: true, length: 1500 })
    biography: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('int', { name: 'ispublic', unsigned: true, default: () => '\'0\'' })
    isPublic: number;

    @Column('varchar', { name: 'defaultrights', nullable: true, length: 250 })
    defaultRights: string | null;

    @Column('varchar', { name: 'rightsholder', nullable: true, length: 250 })
    rightsHolder: string | null;

    @Column('varchar', { name: 'rights', nullable: true, length: 250 })
    rights: string | null;

    @Column('varchar', { name: 'accessrights', nullable: true, length: 250 })
    accessRights: string | null;

    @Column('varchar', { name: 'guid', nullable: true, length: 45 })
    guid: string | null;

    @Column('varchar', { name: 'validated', length: 45, default: () => '\'0\'' })
    validated: string;

    @Column('varchar', { name: 'usergroups', nullable: true, length: 100 })
    userGroups: string | null;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @Column('timestamp', {
        name: 'lastLogin',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    lastLogin: Date;

    @OneToMany(() => RefreshToken, (token) => token.uid)
    refreshToken: Promise<RefreshToken>;

    @OneToMany(() => AdminStat, (adminstats) => adminstats.user)
    adminStats: Promise<AdminStat[]>;

    @OneToMany(
        () => OccurrenceVerification,
        (omoccurverification) => omoccurverification.user
    )
    occurrenceVerifications: Promise<OccurrenceVerification[]>;

    @OneToMany(() => TraitAttribute, (tmattributes) => tmattributes.creator)
    createdTraitAttributes: Promise<TraitAttribute[]>;

    @OneToMany(() => TraitAttribute, (tmattributes) => tmattributes.lastModifier)
    modifiedTraitAttributes: Promise<TraitAttribute[]>;

    @OneToMany(() => Medium, (media) => media.author)
    media: Promise<Medium[]>;

    @OneToMany(
        () => ImageKeyword,
        (imagekeywords) => imagekeywords.assignedBy
    )
    imageKeywords: Promise<ImageKeyword[]>;

    @OneToMany(() => OccurrenceEdit, (omoccuredits) => omoccuredits.user)
    occurrenceEdits: Promise<OccurrenceEdit[]>;

    @OneToMany(() => Image, (images) => images.photographer)
    images: Promise<Image[]>;

    @OneToMany(() => UserRole, (userroles) => userroles.user)
    roles: Promise<UserRole[]>;

    @OneToMany(() => UserRole, (userroles) => userroles.assigner)
    assignedRoles: Promise<UserRole[]>;

    @OneToMany(() => OccurrenceRevision, (omoccurrevisions) => omoccurrevisions.user)
    occurrenceRevisions: Promise<OccurrenceRevision[]>;

    @OneToMany(
        () => CollectionContact,
        (omcollectioncontacts) => omcollectioncontacts.contact
    )
    collectionContacts: Promise<CollectionContact[]>;

    @OneToMany(() => GlossaryImage, (glossaryimages) => glossaryimages.user)
    glossaryImages: Promise<GlossaryImage[]>;

    @OneToMany(() => UserTaxonomy, (usertaxonomy) => usertaxonomy.user)
    userTaxonomies: Promise<UserTaxonomy[]>;

    @OneToMany(() => TraitState, (tmstates) => tmstates.creator)
    createdTraitStates: Promise<TraitState[]>;

    @OneToMany(() => TraitState, (tmstates) => tmstates.lastModifier)
    modifiedTraitStates: Promise<TraitState[]>;

    @OneToMany(
        () => TaxonProfilePublication,
        (taxaprofilepubs) => taxaprofilepubs.owner
    )
    taxonProfilePublications: Promise<TaxonProfilePublication[]>;

    @OneToMany(() => OccurrenceComment, (omoccurcomments) => omoccurcomments.commenter)
    occurrenceComments: Promise<OccurrenceComment[]>;

    @OneToMany(() => UserAccessToken, (useraccesstokens) => useraccesstokens.user)
    accessTokens: Promise<UserAccessToken[]>;

    @OneToMany(() => ChecklistTaxonComment, (fmcltaxacomments) => fmcltaxacomments.commenter)
    checklistTaxonComments: Promise<ChecklistTaxonComment[]>;

    @OneToMany(
        () => CrowdSourceQueue,
        (omcrowdsourcequeue) => omcrowdsourcequeue.processor
    )
    crowdSourceQueues: Promise<CrowdSourceQueue[]>;

    @OneToMany(
        () => OccurrenceAssociation,
        (omoccurassociations) => omoccurassociations.creator
    )
    createdOccurrenceAssociations: Promise<OccurrenceAssociation[]>;

    @OneToMany(
        () => OccurrenceAssociation,
        (omoccurassociations) => omoccurassociations.lastModifiedUser
    )
    modifiedOccurrenceAssociations: Promise<OccurrenceAssociation[]>;

    @OneToMany(() => Trait, (tmtraits) => tmtraits.creator)
    createdTraits: Promise<Trait[]>;

    @OneToMany(() => Trait, (tmtraits) => tmtraits.lastModifier)
    modifiedTraits: Promise<Trait[]>;

    @OneToMany(() => OccurrenceDataset, (omoccurdatasets) => omoccurdatasets.user)
    occurrenceDatasets: Promise<OccurrenceDataset[]>;

    @OneToMany(
        () => ActionRequest,
        (actionrequest) => actionrequest.requester
    )
    actionRequests: Promise<ActionRequest[]>;

    @OneToMany(
        () => ActionRequest,
        (actionrequest) => actionrequest.fulfiller
    )
    fulfilledActionRequests: Promise<ActionRequest[]>;

    @OneToMany(() => Checklist, (fmchecklists) => fmchecklists.user)
    checklists: Promise<Checklist[]>;

    @OneToMany(() => Occurrence, (omoccurrences) => omoccurrences.observer)
    observedOccurrences: Promise<Occurrence[]>;

    @OneToMany(() => Institution, (institutions) => institutions.lastModifiedUser)
    institutions: Promise<Institution[]>;

    @OneToMany(() => Taxon, (taxa) => taxa.lastModifiedUser)
    modifiedTaxa: Promise<Taxon[]>;

    @OneToMany(() => Glossary, (glossary) => glossary.creator)
    glossaries: Promise<Glossary[]>;

    @OneToMany(() => TaxonDescriptionBlock, (tdr) => tdr.creator)
    taxonDescriptionBlocks: Promise<TaxonDescriptionBlock[]>;

    @OneToMany(() => Unknown, (unknowns) => unknowns.user)
    unknowns: Promise<Unknown[]>;

    @OneToMany(() => UserNotification, (notification) => notification.user)
    notifications: Promise<UserNotification[]>;
}
