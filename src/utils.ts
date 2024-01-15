import { Actor, HttpAgent } from '@dfinity/agent';

export const getWizardDetails = async (agentId: string) => { 
  
   type WizardVisibility = { 'privateVisibility' : null } |
  { 'publicVisibility' : null } |
  { 'unlistedVisibility' : null };

   interface WizardDetails {
    'id' : string,
    'userId' : string,
    'name' : string,
    'biography' : string,
    'greeting' : string,
    'description' : string,
    'summary' : [] | [string],
    'visibility' : WizardVisibility,
    'avatar' : string,
  }

const agent = new HttpAgent({host:"https://icp0.io"});
const canisterId = import.meta.env.VITE_CANISTER_BACKEND_ID;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const idlFactory = ({ IDL }: {IDL:any}) => {
  const WizardVisibility = IDL.Variant({
    'privateVisibility' : IDL.Null,
    'publicVisibility' : IDL.Null,
    'unlistedVisibility' : IDL.Null,
  });
  const WizardDetails = IDL.Record({
    'id' : IDL.Text,
    'userId' : IDL.Text,
    'name' : IDL.Text,
    'biography' : IDL.Text,
    'greeting' : IDL.Text,
    'description' : IDL.Text,
    'summary' : IDL.Opt(IDL.Text),
    'visibility' : WizardVisibility,
    'avatar' : IDL.Text,
  });

  const Main = IDL.Service({
    'getWizard' : IDL.Func([IDL.Text], [IDL.Opt(WizardDetails)], ['query']),
  });
  return Main;
};

const backendCanister =  Actor.createActor(idlFactory,{agent,canisterId});
const data = await backendCanister.getWizard(agentId) as WizardDetails[];
return data[0];
};