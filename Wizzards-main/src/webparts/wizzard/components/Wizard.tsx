import * as React from 'react';
import  {useEffect, useState} from 'react';

import { DefaultButton, PrimaryButton, Stack, StackItem } from 'office-ui-fabric-react';
import Countdown from 'react-countdown';
import { IWizardProperties } from './IWizardProperties';
import { IWizardStep } from './IWizardStep';
import { sp } from "@pnp/sp";  

import "@pnp/sp/webs";  
import "@pnp/sp/lists";  
import "@pnp/sp/items";
import "@pnp/sp/site-users"
import "@pnp/sp/files";

function Wizard(props : IWizardProperties ){
  const steps = props.steps;
  const context = props.context;
  const listTitle = "Logs";
  const initStep : IWizardStep = {idx: -1, title: 'Start', body: '<div></div>', allowBack: false, times:15000, showButtons: true};

  const [activeStep, setActiveStep] = useState(initStep);
  const [completed, setCompleted] = useState(null);
  const loadLog = async()=>{
    debugger;

    const user = await sp.web.currentUser.get();
    const filter = `Author eq ${user.Id} and Context eq '${context}' and Status eq 'Completed'`;

    const filtered = await sp.web.lists.getByTitle(listTitle).items.filter(filter).orderBy('Created', false).get();
    
    console.log(filtered);
    console.log(filtered.length);

    const lastItem = filtered.length > 0 ? filtered[0] : null;

    setCompleted(lastItem);
  }
  
  //todo: perduoti i funkcija info apie zingsiu + trukme
  const writeLog = async (definition:string,step:number, isLastStep:boolean) => {

    
    // const context = "demo training";
    const message = `${context}: ${new Date().toISOString()}`;
    debugger;      
    const status = isLastStep? "Completed":"In progress";
    const duration = Math.floor(Math.random()*100);
    
    const item = await sp.web.lists.getByTitle(listTitle).items.add({Title: message, Definition:definition, Step:`Step ${step+1} from ${steps.length}`, Context:context , Status: status, Duration: duration});
    

    debugger;

    console.log(item);
  };

  const genCertificate = async ()=>{
    debugger;
    // https://lmvtech.sharepoint.com/
    const srcPath = "/sites/lmvtech/Certificates/_Templates/Interactive_Course_Template.docx";
    const destPath = "/sites/lmvtech/Certificates/Documents/Interactive_Course_certificate.docx";
    const shouldOverWrite = true;
    const  keepBoth =false;
    await sp.web.getFileByServerRelativePath(srcPath).copyByPath(`${destPath}`, shouldOverWrite, keepBoth);
    const item = await sp.web.getFileByServerRelativeUrl(destPath).getItem();
    await item.update(
      {
        TitleOfTraining:context,
        Trainee:null,
        Trainer:null,
        DateOfCompletion: new Date(),
        Duration: Math.floor(Math.random()*100) 


      }
    );
  }
  

  
  

  const start = async () => {
    await writeLog(steps[0].body,0,false);
    setActiveStep(steps[0]);

  };

  const next = async () => {
    const isLastStep = activeStep.idx+1 == steps.length - 1; 
    if(activeStep.idx < steps.length - 1){
     
      await writeLog( steps[activeStep.idx+1].body,activeStep.idx+1, isLastStep);
      setActiveStep(steps[activeStep.idx + 1]);
    //   const isLastStep = activeStep.idx+1 == steps.length - 1; 
    // debugger;
    // if(isLastStep){
    //   await writeLog( steps[activeStep.idx+1].body,activeStep.idx+1, isLastStep);
    // }
    
    }
    
  };
  
  const prev =  async () => {
    if(activeStep.allowBack && activeStep.idx > 0){
      await writeLog(steps[activeStep.idx-1].body,activeStep.idx-1, false);
      setActiveStep(steps[activeStep.idx - 1]);
    }
    
  };
  const countdown = <Countdown date={Date.now() + Number(activeStep.times)} onComplete={next} key={activeStep.idx} ></Countdown>;
  const butto=<div><Stack horizontal> <StackItem><DefaultButton onClick={() => prev()} disabled={!activeStep.allowBack}>PREV</DefaultButton> | <PrimaryButton onClick={next}>NEXT</PrimaryButton></StackItem></Stack></div> ;
  const moving = <div>{activeStep.showButtons===true ?butto: '' }</div>;
  const timer = <div>{activeStep.times ?countdown: '' }</div>;
  const progress=<div><h1>{activeStep.idx+1} from {steps.length}</h1></div>;
  const progressshow=<div>{activeStep.showButtons===true ?progress: '' }</div>;
    

  const formBody = <div dangerouslySetInnerHTML={{__html: activeStep.body}}></div>;
  const form = <div>
    <div>{timer}</div>
      <div>{progressshow}</div>
      <div>{formBody}</div>
      
      <div>{moving}</div>
  </div>;


  useEffect(() => {
   
    (async function load() {
      await loadLog();
    })();
  }, []); 

  const inProgress =   <div>{activeStep.idx  === -1 ? <PrimaryButton onClick={start}>START</PrimaryButton> : form }</div>;
  const generateCertificateButton=<div><PrimaryButton onClick={genCertificate}>Sertificate</PrimaryButton></div>;
  debugger;
  const afterCompleted = <div> You have already completed this course on{completed==null ?'': new Date( completed.Created).toDateString()}{generateCertificateButton}</div>;
debugger;
  const showing = <div><h1>{context}</h1><div>{completed==null ?inProgress: afterCompleted}</div></div>;




  
    return (
     <div>{showing}</div> 
    );
}
export default Wizard;

