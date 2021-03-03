import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'symbiotaDetectLinks'
})
export class DetectLinksPipe implements PipeTransform {
    transform(value: any): any {
        if (typeof value !== 'string') {
            return value;
        }

        let newText = value.slice();

        if (value.includes(' ')) {
            for (const word of value.split(' ')) {
                newText = newText.replace(
                    new RegExp(`(?<= ?)${DetectLinksPipe.escapeRegex(word)}(?= ?)`, 'g'),
                    DetectLinksPipe.detectLinks(word)
                );
            }
        }
        else {
            newText = DetectLinksPipe.detectLinks(value);
        }

        return newText;
    }

    private static detectLinks(text: string): string {
        if (text.startsWith('http')) {
            return `<a [href]="${text}" target="_blank">${text}</a>`;
        }
        return text;
    }

    private static escapeRegex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
