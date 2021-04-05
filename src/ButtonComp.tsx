import Button from '@material-ui/core/Button';

function ButtonComp(props:any) {
  const {name, color}=props;
  return (
    <Button variant="contained" style={{backgroundColor:color, color:"white"}} onClick={()=>{
      props.buttonClick(name);
    }}>
{name}
    </Button>
  );
}

export default ButtonComp;
