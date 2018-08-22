/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as cp from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

export const repoRoot = path.join(__dirname, '..', '..', '..');
export const basicRazorAppRoot = path.join(repoRoot, 'test', 'testapps', 'BasicRazorApp');

export async function pollUntil(fn: () => boolean, timeoutMs: number) {
    const pollInterval = 50;
    let timeWaited = 0;
    while (!fn()) {
        if (timeWaited >= timeoutMs) {
            throw new Error(`Timed out after ${timeoutMs}ms.`);
        }

        await new Promise(r => setTimeout(r, pollInterval));
        timeWaited += pollInterval;
    }
}

export async function dotnetRestore(cwd: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const dotnet = cp.spawn('dotnet', [ 'restore' ], { cwd, env: process.env });

        dotnet.stdout.on('data', (data: any) => {
            console.log(data.toString());
        });

        dotnet.stderr.on('err', (error: any) => {
            console.log(`Error: ${error}`);
        });

        dotnet.on('close', (exitCode) => {
            console.log(`Done: ${exitCode}.`);
            resolve();
        });

        dotnet.on('error', error => {
            console.log(`Error: ${error}`);
            reject(error);
        });
    });
}

export async function extensionActivated<T>(identifier: string) {
    const extension = vscode.extensions.getExtension<T>(identifier);

    if (!extension) {
        throw new Error(`Could not find extension '${identifier}'`);
    }

    if (!extension.isActive) {
        await extension.activate();
    }

    return extension;
}

export async function csharpExtensionReady() {
    const csharpExtension = await extensionActivated<CSharpExtensionExports>('ms-vscode.csharp');

    try {
        await csharpExtension.exports.initializationFinished();
        console.log('C# extension activated');
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}

export async function htmlLanguageFeaturesExtensionReady() {
    await extensionActivated<any>('vscode.html-language-features');
}

interface CSharpExtensionExports {
    initializationFinished: () => Promise<void>;
}