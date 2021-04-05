
import React from 'react';	

const initialState={
  basic:{
    name:'',
    website:'',
    industry:'',
    industryId:'',
    accountOwner:'',
    companySize:'',
    companySizeId:''
  },
  notes:'',
  locations:[
    {
      branch:'Delhi Branch',
      contactPerson:'',
      doorNo:'',
      street:'',
      city:'',
      state:'',
      stateId:'',
      country:'',
      countryId:'',
      zipCode:'',
      phone:'',
      email:''
    },
    {
      branch:'Banglore Branch',
      contactPerson:'',
      doorNo:'',
      street:'',
      city:'',
      state:'',
      stateId:'',
      country:'',
      countryId:'',
      zipCode:'',
      phone:'',
      email:''
    }
  ]
}
 
function reducer(state = initialState, action){
switch (action.type) {
    case "FORM":
      state = {...state, ...action.payload};
    return {...state};
    default:
      return {...state};
  }
}
 
export default reducer;