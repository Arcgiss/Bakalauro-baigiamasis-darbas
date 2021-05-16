import * as React from 'react';
import styles from './Button.module.scss';
import { IButtonProps } from './IButtonProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton } from 'office-ui-fabric-react';
import { useEffect, useState } from 'react';
import { sp } from "@pnp/sp";  
import "@pnp/sp/webs";  
import "@pnp/sp/lists";  
import "@pnp/sp/items";
import "@pnp/sp/site-users";
import "@pnp/sp/files";


function Button (props:IButtonProps){

const description =props.description;
const context=props.context;
const step =props.step;
const name = props.name;
const path =props.path;
const destination = props.destination;

 
const [completed, setCompleted] = useState(null);
  const listTitle = "Logs";
  const loadLog = async()=>{
    debugger;

    const user = await sp.web.currentUser.get();
    const filter = `Author eq ${user.Id} and Context eq '${context}' and Status eq 'Completed'`;

    const filtered = await sp.web.lists.getByTitle(listTitle).items.filter(filter).orderBy('Created', false).get();
    
    console.log(filtered);
    console.log(filtered.length);

    const lastItem = filtered.length > 0 ? filtered[0] : null;

    setCompleted(lastItem);
  };

  const writeLog = async (isCompleted:boolean) => {

    
    
    const message = `${description}: ${new Date().toISOString()}`;
    debugger;      
    const status = isCompleted? "Completed":"In progress";
    const duration = Math.floor(Math.random()*100);
    
    
    const item = await sp.web.lists.getByTitle(listTitle).items.add({Title: message, Definition:description, Step: step, Context:context , Status: status, Duration: duration});
    

    debugger;

    console.log(item);
  };

 

  const push = async () => {

    await writeLog(true);
    await loadLog();
    
  };
  
  const genCertificate = async ()=>{
    debugger;
    
    
    const srcPath = path;
    const destPath = destination;
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
  };
  useEffect(() => {
   
    (async function load() {
      await loadLog();
    })();
  }, []); 

  const registerButton=<div><PrimaryButton onClick={push}>{name}</PrimaryButton></div>;
  const generateCertificateButton=<div><PrimaryButton onClick={genCertificate}>Sertificate</PrimaryButton></div>;
   const afterRegistration =<div><h1>{context}</h1> You have already registerred for this course {completed==null ?'': new Date( completed.Created).toDateString()}{generateCertificateButton}</div>;

   const showing = <div><div>{completed==null ?registerButton: afterRegistration}</div></div>;

  return (
      <div >{showing}</div>
     
   );

}
export default Button;
