import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ButtonWebPartStrings';
import Button from './components/Button';
import { IButtonProps } from './components/IButtonProps';
import {sp} from '@pnp/sp';

export interface IButtonWebPartProps {
  name: string;
  context: string;
  description: string;
  step: string;
  path:string;
  destination:string;
}

export default class ButtonWebPart extends BaseClientSideWebPart<IButtonWebPartProps> {
  
  
  public onInit(): Promise<void> {  
    return super.onInit().then(_ => {    
      sp.setup({  
        spfxContext: this.context  
      });  
    });  
  }

  public render(): void {
    const element: React.ReactElement<IButtonProps> = React.createElement(
      Button,
      {
        name: this.properties.name,
        description: this.properties.description,
        context: this.properties.context,
        step:this.properties.step,
        path:this.properties.path,
        destination: this.properties.destination,


      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('name', {
                  label: 'Button name'
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('context', {
                  label: 'Context'
                }),
                PropertyPaneTextField('step', {
                  label: 'Step'
                }),
                PropertyPaneTextField('path', {
                  label: 'Path off certificate'
                }),
                PropertyPaneTextField('destination', {
                  label: 'Destination for certificate'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
