export interface IWizardStep {
    idx: number;
    title: string;
    body: string;
    allowBack: boolean;
    times: number;
    showButtons: boolean;
    
}