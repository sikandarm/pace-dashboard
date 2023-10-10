import React, {  useState } from 'react';
import CTextField from '../CTextField/CTextField';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import CSwitch from '../CSwitch/CSwitch';
import { createInventory } from '../../feature/inventorySlice';
import CSelect from '../CSelect/CSelect';
import { toast } from 'react-toastify';
import { validateionInverntory } from '../../utils/validationInventory';
const AddInventory = (props) => {
  const dispatch = useDispatch();
  const [inventoryData, setInventoryData] = useState({
    ediStdNomenclature: '',
    aiscManualLabel: '',
    weight: '',
    depth: '',
    grade: '',
    poNumber: '',
    heatNumber: '',
    lengthReceivedFoot: '',
    lengthReceivedInch: '',
    quantity: '',
    poPulledFromNumber: '',
    lengthUsedFoot: '',
    lengthUsedInch: '',
    lengthRemainingFoot: '',
    lengthRemainingInch: '',
  });
  const [orderArrivedInFull, setOrderArrivedInFull] = useState(false);
  const [orderArrivedCMTR, setOrderArrivedCMTR] = useState(false);
  const shapeData = ['2L', 'C', 'HP', 'HSS', 'L', 'M', 'MC', 'MT', 'PIPE', 'S', 'ST', 'W', 'WT'];
  const [selectShape, setSelectedShape] = useState('');
  const [itemType, setItemType] = useState('');
  const selectItemType = ['stock', 'job'];
  const handleChange = (event) => {
    setInventoryData((prv) => ({ ...prv, [event.target.name]: event.target.value }));
  };

  const handleSubmit = () => {
    const shape = selectShape;
    let finalData = { ...inventoryData, orderArrivedCMTR, orderArrivedInFull, shape, itemType };
    if (validateionInverntory({ ...finalData })) {
      dispatch(createInventory(finalData)).then((res) => {
        if (res.type === 'createInventory/Inventory/rejected') {
          toast(res.payload);
          return;
        }
        if (res.type === 'createInventory/Inventory/fulfilled') {
          toast('Inventory created successfully !');
          props.setOpen(false);
        }
      });
    }
    return;
  };
  return (
    <div style={{ overflowY: 'scroll', maxHeight: '550px', overflowX: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#2065D1',
          borderRadius: 10,
          color: 'white',
          marginBottom: '20px',
        }}
      >
        <p>Add Inventory</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="ediStdNomenclature"
          label="EdiStd Nomen Clature"
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="aiscManualLabel"
          label="Aisc Manual Label"
        />
        <CSelect
          width="310px"
          data={shapeData}
          label="Select Shape"
          initialValue={selectShape}
          setinitialValue={setSelectedShape}
          margin="5px 0px"
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          type={'Number'}
          name="weight"
          label="Weight"
        />
        <CTextField
          margin="5px 0px"
          type={'Number'}
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="depth"
          label="Depth"
        />
        <CTextField
          margin="5px 0px"
          // type={'Number'}
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="grade"
          label="Grade"
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="poNumber"
          label="Po Number"
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="heatNumber"
          label="Heat Number"
        />
        <CSelect
          width="310px"
          data={selectItemType}
          label="Select Item Type"
          initialValue={itemType}
          setinitialValue={setItemType}
          margin="5px 0px"
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="lengthReceivedFoot"
          label="Length Received Foot"
          type={'Number'}
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="lengthReceivedInch"
          label="Length Received Inch"
          type={'Number'}
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="quantity"
          label="Quantity"
          type={'Number'}
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="poPulledFromNumber"
          label="Po Pulled From Number"
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="lengthUsedFoot"
          label="Length Used Foot"
          type={'Number'}
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="lengthUsedInch"
          label="Length Used Inch"
          type={'Number'}
        />
        <CTextField
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="lengthRemainingInch"
          label="Length Remaining Inch"
          type={'Number'}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '20px 5px',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '50%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '0px 10px',
            }}
          >
            Order Arrived In Full
            <CSwitch
              active={orderArrivedInFull}
              name="orderArrivedInFull"
              setSwitch={() => setOrderArrivedInFull(!orderArrivedInFull)}
            />
          </div>
          <div
            style={{
              display: 'flex',
              width: '50%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '0px 10px',
            }}
          >
            Order Arrived CMTR
            <CSwitch
              active={orderArrivedCMTR}
              name="orderArrivedCMTR"
              setSwitch={() => setOrderArrivedCMTR(!orderArrivedCMTR)}
            />
          </div>
        </div>
        <CTextField
          margin="5px 0px"
          //   width={300}
          fullWidth={true}
          onChange={handleChange}
          name="lengthRemainingFoot"
          label="Length Remaining Foot"
          type={'Number'}
        />
        <Button
          disabled={props.isLoading}
          onClick={handleSubmit}
          variant="outlined"
          sx={{ width: '100%', margin: '10px 10px 0px 10px' }}
        >
          {props.isLoading ? 'Loading...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
};

export default AddInventory;
