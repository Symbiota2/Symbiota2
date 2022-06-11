import { Inject, Injectable, Logger } from '@nestjs/common';
import { Brackets, DeleteResult, In, Repository } from 'typeorm';
import { BaseService } from '@symbiota2/api-common'
import { Express } from 'express';
import { StorageService } from '@symbiota2/api-storage';
import * as fs from 'fs';
import { AppConfigService } from '@symbiota2/api-config';

import path from 'path';
import { I18nInputDto } from './dto/I18nInputDto';

// type File = Express.Multer.File

@Injectable()
export class I18nService {
    public static readonly S3_PREFIX = 'i18n'
    // public static readonly assetsFolder = path.join("data", "uploads", "images")
    private static reverseMap = null
    private readonly logger = new Logger(I18nService.name)

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly storageService: StorageService)
    {
        // I18nService.libraryFolder = this.appConfig.imageLibrary()
        // this.loadReverseMap()
    }

    public static s3Key(objectName: string): string {
        return [I18nService.S3_PREFIX, objectName].join('/');
    }

    /*
    private loadReverseMap() {
        console.log("loading reverse map")
        if (I18nService.reverseMap == null) {
            // Load the reverse map
            I18nService.reverseMap = new Map<string, string>()

            const dirName = path.join("apps", "ui", "src", "assets", "i18n")
            const dir = fs.readdirSync(dirName)
            for (let fileName of dir) {
                console.log("read file" + fileName)
            }
        }
    }
     */

    /**
     * Modify a key value pair
     * @param data The data to update
     * @return I18nInputDto The updated data or null (not found or api error)
     */
    async modify(pair: I18nInputDto): Promise<I18nInputDto> {
        try {
            // First load the reverse key lookup
            if (pair.language == null || pair.key == null || pair.value == null || pair.key == "" || pair.value == "") {
                this.logger.warn("I18n service trying to update key/value pair, but missing information, key: " + pair.key + " value: " + pair.value + " language: " + pair.language)
                return null
            }  else {
                const language = pair.language
                console.log("language is " + language)
                const fileName = path.join("apps", "ui", "src", "assets", "i18n", "reversed." + language + ".json")
                console.log("filename is " + fileName)
                const reverseLookup = JSON.parse(fs.readFileSync(fileName).toString())
                // Do we have a key
                if (reverseLookup[pair.key] != undefined) {
                    // Glob the original file
                    const dir = reverseLookup[pair.key]
                    const destDir = path.dirname(dir)
                    console.log("dir " + dir + " " + destDir)
                    // Need to determine where the current file resides
                    let destFileName = ""
                    if (path.basename(dir) == "notranslate") {
                        // Currently not translated
                        destFileName = pair.translatable ?
                            path.join(destDir, "translate", "modifications", language + ".json")
                            : path.join(dir, language + ".json")
                    } else {
                        destFileName = pair.translatable ?
                            path.join(destDir, "modifications", language + ".json")
                            : path.join(path.dirname(destDir), "notranslate", language + ".json")
                    }
            /*
                    const destFileName = pair.translatable ?
                        path.join(destDir, "modifications", language + ".json")
                        : path.basename(destDir) == "translate" ?
                            path.join(path.dirname(destDir), "notranslate", language + ".json")
                            : path.join(destDir, language + ".json")
              */
                    const lookup = fs.existsSync(destFileName) ?
                        JSON.parse(fs.readFileSync(destFileName).toString())
                        : {}
                    // Set the updated pair
                    lookup[pair.key] = pair.value
                    // Write the updated file
                    fs.writeFileSync(destFileName, JSON.stringify(lookup,null,4))
                    this.logger.log("updated " + pair.key + " to " + pair.value + " in " + destFileName)

                    // Now update the asset
                    const assetFileName = path.join("apps", "ui", "src", "assets", "i18n", language + ".json")
                    const keyMap = JSON.parse(fs.readFileSync(assetFileName).toString())
                    if (keyMap[pair.key] != undefined) {
                        keyMap[pair.key] = pair.value
                        fs.writeFileSync(assetFileName, JSON.stringify(keyMap,null,4))
                    } else {
                        this.logger.warn("I18n service trying to update key " + pair.key + " but key was not found.")
                        return null
                    }
                    return pair
                } else {
                    this.logger.warn("I18n service trying to update key " + pair.key + " but key was not found.")
                }
            }
        }
        catch (e) {
            this.logger.error("Problem in modifying an i18n key/value pair " + e)
            return null
        }
    }

}
