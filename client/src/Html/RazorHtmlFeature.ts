/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import { RazorDocumentManager } from '../RazorDocumentManager';
import { RazorLanguageServiceClient } from '../RazorLanguageServiceClient';
import { HtmlPreviewDocumentContentProvider } from './HtmlPreviewDocumentContentProvider';
import { HtmlProjectedDocumentContentProvider } from './HtmlProjectedDocumentContentProvider';
import { HtmlTagCompletionProvider } from './HtmlTagCompletionProvider';

export class RazorHtmlFeature {
    public readonly projectionProvider: HtmlProjectedDocumentContentProvider;
    public readonly previewProvider: HtmlPreviewDocumentContentProvider;
    private readonly htmlTagCompletionProvider: HtmlTagCompletionProvider;

    constructor(
        documentManager: RazorDocumentManager,
        serviceClient: RazorLanguageServiceClient) {
        this.projectionProvider = new HtmlProjectedDocumentContentProvider(documentManager);
        this.previewProvider = new HtmlPreviewDocumentContentProvider(documentManager);
        this.htmlTagCompletionProvider = new HtmlTagCompletionProvider(serviceClient);
    }

    public register() {
        const registrations = [
            vscode.workspace.registerTextDocumentContentProvider(
                HtmlProjectedDocumentContentProvider.scheme, this.projectionProvider),
            vscode.workspace.registerTextDocumentContentProvider(
                HtmlPreviewDocumentContentProvider.scheme, this.previewProvider),
            vscode.commands.registerCommand(
                'extension.showRazorHtmlWindow', () => this.previewProvider.showRazorHtmlWindow()),
            this.htmlTagCompletionProvider.register(),
        ];

        return vscode.Disposable.from(...registrations);
    }
}
