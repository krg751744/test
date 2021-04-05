import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { formatDiagnostic } from 'typescript';
import { useSelector, useDispatch } from "react-redux";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PhoneIcon from '@material-ui/icons/Phone'; 
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ButtonComp from './ButtonComp';
import Grid from '@material-ui/core/Grid';
import Editor from './Editor';
import FormControl from '@material-ui/core/FormControl';
const lodashClonedeep = require('lodash.clonedeep');

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

const Styles = makeStyles({
  edit: {
    backgroundColor:"#8080808c",
    top:"-3px",
    left:"7px",
    position:"relative",
    borderRadius:"10px",
    fontSize:"10px",
    padding:"5px",
    color:"white",
    cursor:"pointer",
  },
  greenEdit:{
    backgroundColor:"#1edc11e8",
    padding:"5px",
    borderRadius:"5px",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer",
  },
});


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{backgroundColor:"white"}}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function App() {
  const classes = Styles();
  const form = useSelector((state:any) => state);
  let test=lodashClonedeep(form);
  test.locations[0]=lodashClonedeep(form.locations[0]);
  test.locations[1]=lodashClonedeep(form.locations[1]);
  const [initial, setUpdate]=useState(test);
  const dispatch = useDispatch();
  const [open, setOpen]=useState<boolean>(false);
  const [error, setErrors]=useState<boolean>(false);
  const [value, setValue] = useState(0);
  const handleClose=()=>{
    setOpen(false);
  }
  useEffect(() => {
    setErrors(false);
  }, [open, value]);

  const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

  
  const validate=()=>{
    switch(value){
      case 0:
      let basic = initial.basic;
      let array = Object.keys(basic);
      let temp=0;
      array.forEach(function(iter:any){
        let buffer = getKeyValue(iter)(basic);
        if( buffer == ''){
       temp++
        }
      });
      if(temp > 0){
        return false;
      }
      else
      {
        return true;
      }

      case 1:
        let locations = initial.locations;
        let tempLoc=0;
        locations.forEach(function(iter:any){
            let arrayLoc = Object.keys(iter);
            arrayLoc.forEach(function(i:any){
              if(iter[i] == ''){
             tempLoc++
              }
            });
        })
        if(tempLoc > 0){
          return false;
        }
        else
        {
          return true;
        }
  
      default:
        let notes = initial.notes;
      if(notes === ''){
        return false;
      }
      else
      {
        return true;
      }

    }
  }

  const update=(value:any, text:string)=>{
    let data=lodashClonedeep(initial);
    data.locations.forEach(function(iter:any, pos:number){
      data.locations[pos]=lodashClonedeep(iter);
    })
   if(text.indexOf("-") >= 0)
   {
    if(text.split("-")[0] === "basic")
    {
      if(text.split("-")[1].indexOf("Id") >= 0)
      {
        data.basic[text.split("-")[1] as keyof typeof data.basic]=value[0];
        data.basic[text.split("-")[1].slice(0, -2) as keyof typeof data.basic]=value[1];
      }
      else
         data.basic[text.split("-")[1] as keyof typeof data.basic]=value;
    }
    else
    {
      let index = text.charAt(text.indexOf("[")+1);
      let i = parseInt(index);
      if(text.split("-")[1].indexOf("Id") >= 0)
      {
        data.locations[i][text.split("-")[1] as keyof typeof data.locations[0]]=value[0];
        data.locations[i][text.split("-")[1].slice(0, -2) as keyof typeof data.locations[0]]=value[1];
      }
      else
      data.locations[i][text.split("-")[1] as keyof typeof data.locations[0]]=value;
    }
   }
   else
   {
    data.notes=value;
   }
   console.log(data);
   setUpdate(data);
  }


  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if(validate())
    setValue(newValue);
    else
        {
          setErrors(true);
          alert("Please Fill the missing fields");
        }
  };
   const handleChangeIndex = (index: number) => {
    if(validate())
    setValue(index);
    else
        {
          setErrors(true);
          alert("Please Fill the missing fields");
        }
  };
  const openModal=()=>{
    setOpen(true);    
  }
  const buttonClick=(name:string)=>{
    switch(name)
    {
      case "Next":
        if(validate())
        {
          setValue(value +1);
        }
        else
        {
          setErrors(true);
          alert("Please Fill the missing fields");
        }
      break;
      case "Previous":
          setValue(value -1);
      break;
      default:
        if(validate())
        {
          dispatch({type:"FORM", payload:initial });
          setOpen(false);
        }
        else
        {
          setErrors(true);
          alert("Please Fill the missing fields");
        }
      break;
    }
  }
  const deleteObj=(id:any)=>{
    let data=lodashClonedeep(initial);
    data.locations.forEach(function(iter:any, pos:number){
      data.locations[pos]=lodashClonedeep(iter);
    })
    data.locations.splice(id,1);
    setUpdate(data);
    dispatch({type:"FORM", payload:data});
  }

  

  const htmlFun=(val:string)=>{
    return <div dangerouslySetInnerHTML={{ __html: val }} />
  }

  const locationFun=(val:any, flag:boolean)=>{
    
    let array=val.map(function(iter:any, pos:number){
      return <Accordion defaultExpanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        style={{display:"flex"}}
      >
          <div>{iter.branch}</div>
          <div style={{marginLeft:"auto"}}><span id={pos.toString()} onClick={(e:any)=>{deleteObj(e.target.id)}} style={{backgroundColor:"#80808040", borderRadius:"5px", padding:"5px"}}><DeleteIcon style={{fontSize:"15px"}} /> Delete</span></div>
      </AccordionSummary>
      <AccordionDetails>
        {flag ?
       <Box p={2}>
         <div style={{display:"flex"}}>
           <div>Contact Person : </div>
           <div>{iter.contactPerson}</div>
         </div>
         <br />
         <div style={{display: iter.doorNo ==='' ? "none":"block"}}>
         <div>
           {iter.doorNo} , {iter.street} ,{iter.city}
         </div>
         <div>
           {iter.state} , {iter.country} ,{iter.zipCode}
         </div>
         </div>
         <br />
         {iter.phone && <div style={{display:"flex"}}>
           <div><PhoneIcon /> </div>
           <div>{iter.phone}</div>
         </div>}
         <br />
         {iter.mail && <div style={{display:"flex"}}>
           <div><MailIcon /> </div>
           <div>{iter.mail}</div>
         </div>}
       </Box>
       :
       <Box p={2}>
       <Grid container>
       <Grid item xs={6} sm={6}>
       <span>Branch Name</span>
            <div>
            <TextField id={pos.toString()} label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}} 
            value={initial.locations[pos].branch}
            error={(error && (initial.locations[pos].branch == '')) ? true : false}
            onChange={(e:any)=>{
              update(e.target.value, "location["+e.target.id+"]-branch");
            }} />
            </div>
       </Grid>
       <Grid item xs={6} sm={6}>
       <span>Branch Contact Person Name</span>
            <div>
            <TextField id={pos.toString()} label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}} 
            onChange={(e:any)=>{
              update(e.target.value, "location["+e.target.id+"]-contactPerson");
            }}
            value={initial.locations[pos].contactPerson}
            error={(error && (initial.locations[pos].contactPerson == '')) ? true : false} />
            </div>
       </Grid>
  
       <Grid item xs={6} sm={6}>
       <span>Branch Email</span>
            <div>
            <TextField id={pos.toString()} onChange={(e:any)=>{
              update(e.target.value, "location["+e.target.id+"]-email");
            }}
            value={initial.locations[pos].email}
            error={(error && (initial.locations[pos].email == '')) ? true : false}
             label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}} />
            </div>
       </Grid>
       <Grid item xs={6} sm={6}>
       <span>Branch Phone Number</span>
            <div>
            <TextField id={pos.toString()}   onChange={(e:any)=>{
              update(e.target.value, "location["+e.target.id+"]-phone");
            }}
            label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}} 
            value={initial.locations[pos].phone}
            error={(error && (initial.locations[pos].phone == '')) ? true : false}/>
            </div>
       </Grid>
  
       <Grid item xs={12} sm={12} style={{fontWeight:"bold",padding:"20px 0px 20px 0px"}}>
         Branch Address
       </Grid>
      
  
       <Grid item xs={6} sm={6}>
       <span>No/Building/Flat No.</span>
            <div>
            <TextField id={pos.toString()}   onChange={(e:any)=>{
              update(e.target.value, "location["+e.target.id+"]-doorNo");
            }}
             label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}} 
             value={initial.locations[pos].doorNo}
             error={(error && (initial.locations[pos].doorNo == '')) ? true : false}/>
            </div>
       </Grid>
       <Grid item xs={6} sm={6}>
       <span>Street Name</span>
            <div>
            <TextField id={pos.toString()}  onChange={(e:any)=>{
              update(e.target.value, "location["+e.target.id+"]-street");
            }}
            value={initial.locations[pos].street}
            error={(error && (initial.locations[pos].street == '')) ? true : false}
             label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}} />
            </div>
       </Grid>
  
       <Grid item xs={6} sm={6}>
       <span>City/Village</span>
            <div>
            <TextField id={pos.toString()}   onChange={(e:any)=>{
              update(e.target.value, "location["+e.target.id+"]-city");
            }} label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}}
            value={initial.locations[pos].city}
            error={(error && (initial.locations[pos].city == '')) ? true : false} />
            </div>
       </Grid>
       <Grid item xs={6} sm={6}>
       <span>State</span>
            <div>
            <FormControl error={(error && (initial.locations[pos].stateId == '')) ? true : false}  style={{margin:"20px 0px 20px 0px", width:"100%"}}>
            <Select
            labelId="demo-simple-select-outlined-label"
            name={pos.toString()}
            value={initial.locations[pos].stateId}
            onChange={(e:any, val:any)=>{
              update([val.props.value, val.props.children], "location["+e.target.name+"]-stateId");
            }}
            style={{width:"50%"}}
            variant="outlined"
            label=""
          >
            <MenuItem value={0}>Tamil Nadu</MenuItem>
            <MenuItem value={1}>Kerala</MenuItem>
            <MenuItem value={2}>Andra</MenuItem>
          </Select>
          </FormControl>
            </div>
       </Grid>
  
       <Grid item xs={6} sm={6}>
       <span>Zip Code</span>
            <div>
            <TextField id={pos.toString()} onChange={(e:any)=>{
              update(e.target.value, "location["+e.target.id+"]-zipCode"); 
            }}
            value={initial.locations[pos].zipCode}
            error={(error && (initial.locations[pos].zipCode == '')) ? true : false}
             label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}} />
            </div>
       </Grid>
       <Grid item xs={6} sm={6}>
       <span>Country</span>
            <div>
            <FormControl error={(error && (initial.locations[pos].countryId == '')) ? true : false}  style={{margin:"20px 0px 20px 0px", width:"100%"}}>
            <Select
            labelId="demo-simple-select-outlined-label"
            name={pos.toString()}
            value={initial.locations[pos].countryId}
            onChange={(e:any, val:any)=>{
              update([val.props.value, val.props.children], "location["+e.target.name+"]-countryId");
            }}
            style={{width:"50%"}}
            variant="outlined"
            label=""
          >
            <MenuItem value={0}>India</MenuItem>
            <MenuItem value={1}>United States</MenuItem>
            <MenuItem value={2}>Africa</MenuItem>
          </Select>
          </FormControl>
            </div>
       </Grid>
       </Grid>
       </Box>}
      </AccordionDetails>
    </Accordion>
    })
  return array;
  }
  return (
    <div className="App">
     <Box p={2}>
     <div style={{display:"flex"}}>
     <div style={{fontWeight:"bold"}}>Company Detail</div>    
     <div style={{ marginLeft:"auto"}}>
       <span className={classes.greenEdit} onClick={()=>{
         openModal();
       }}>Edit <EditIcon  style={{position:"relative", top:"5px"}} /></span></div>
</div>
<Box p={2}>
  <div style={{fontWeight:"bold"}}>Basic Detail <span className={classes.edit} onClick={()=>{
         openModal();
       }}>Edit</span></div>
  <br />
  <div>Name :</div>
  <div>{form.basic.name}</div>
  <br />
  <br />
  <div>Website :</div>
  <div>{form.basic.website}</div>
  <br />
  <br />
  <Box p={2} id="stringtoHtml" style={{width:"60%", height:"150px", border:"1px solid red", borderRadius:"4px"}}>
    {form.notes == '' ? "Notes (Displays at your Dashboard)" : htmlFun(form.notes)}
  </Box>
  <br />
  <div style={{fontWeight:"bold"}}>Location <span className={classes.edit} onClick={()=>{
         openModal();
         setValue(1);
       }}>Edit</span></div>
  <br />
  <Box style={{width:"62%"}}>
  {locationFun(form.locations, true)}
  </Box>
</Box>
     </Box>
     <Modal
  style={{backgroundColor:"white", width:"80%", marginLeft:"10%", marginTop:"5%"}}
  open={open}
  onClose={handleClose}
  aria-labelledby="simple-modal-title"
  aria-describedby="simple-modal-description"
>
<Box p={2} style={{backgroundColor:"white", height:"80vh"}}>
<div style={{display:"flex"}}>
     <div style={{fontSize:"18px"}}>Edit {initial.basic.name}</div>    
     <div style={{ marginLeft:"auto"}}>
       <span style={{cursor:"pointer"}} onClick={()=>{
         setOpen(false);
       }}>X</span></div>
</div>
<div>
<br />
<AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          style={{backgroundColor:"white"}}
          aria-label="full width tabs example"
        >
          <Tab label="Basic" />
          <Tab label="Location" />
          <Tab label="Notes" />
        </Tabs>
      </AppBar>
      <div style={{ height:"60vh", overflow:"scroll"}}>
      <SwipeableViews
        axis={'x-reverse'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0}>
          <span>Company Name</span>
          <div>
          <TextField id="outlined-basic" onChange={(e:any)=>{
              update(e.target.value, "basic-name");
            }}
            label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}}
            value={initial.basic.name}
            error={(error && (initial.basic.name == '')) ? true : false} />
          </div>

          <span>Company Website URL</span>
          <div>
          <TextField id="outlined-basic" 
          onChange={(e:any)=>{
            update(e.target.value, "basic-website");
          }}
          value={initial.basic.website}
          error={(error && (initial.basic.website == '')) ? true : false}
          label="" variant="outlined" style={{padding:"20px 0px 20px 0px", width:"50%"}} />
          </div>

          <span>Industry</span>
          <div>
          <FormControl error={(error && (initial.basic.industryId == '')) ? true : false} style={{margin:"20px 0px 20px 0px", width:"100%"}}>
          <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={initial.basic.industryId}
          onChange={(e:any, val:any)=>{
            update([val.props.value,val.props.children], "basic-industryId");
          }}
          style={{width:"50%"}}
          variant="outlined"
          label=""
        >
          <MenuItem value={0}>IT Service</MenuItem>
          <MenuItem value={1}>Sales</MenuItem>
          <MenuItem value={2}>Marketing</MenuItem>
        </Select>
        </FormControl>
          </div>

          <span>Company Size</span>
          <div>
          <FormControl error={(error && (initial.basic.companySizeId == '')) ? true : false}  style={{margin:"20px 0px 20px 0px", width:"100%"}}>
          <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={initial.basic.companySizeId}
          onChange={(e:any, val:any)=>{
            update([val.props.value, val.props.children] , "basic-companySizeId");
          }}
          style={{width:"50%"}}
          variant="outlined"
          label=""
        >
          <MenuItem value={0}>10-50</MenuItem>
          <MenuItem value={1}>51-100</MenuItem>
          <MenuItem value={2}>101-200</MenuItem>
        </Select>
        </FormControl>
          </div>

          <span>Account Owner</span>
          <div>
          <TextField id="outlined-basic"  onChange={(e:any)=>{
            update(e.target.value, "basic-accountOwner");
          }}
           label="" variant="outlined" style={{paddingTop:"20px", width:"50%"}}
           value={initial.basic.accountOwner}
           error={(error && (initial.basic.accountOwner == '')) ? true : false} />
          </div>
         
        </TabPanel>
        <TabPanel value={value} index={1}>
        {locationFun(initial.locations, false)}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div style={{paddingTop:"3%"}}>
        <Editor update={update} data={initial.notes}/>
        </div>
        </TabPanel>
      </SwipeableViews>
      </div>
      <br />
      <div style={{display:"flex"}}>
       { (value === 1 || value === 2) &&  <div style={{marginRight:"20px"}}><ButtonComp  name="Previous"  color="blue" buttonClick={buttonClick}/> </div>}
       { (value === 0 || value === 1) && <div><ButtonComp  name="Next"  color="blue" buttonClick={buttonClick}/> </div>}
       
        <div style={{marginLeft:"auto"}}><ButtonComp  name="Save and Complete"  color="#1edc11e8" buttonClick={buttonClick}/> </div>

      </div>
      </div>
</Box>
</Modal>
</div>
  );
}

export default App;
