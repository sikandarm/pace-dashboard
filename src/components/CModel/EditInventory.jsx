import React, {  useState } from 'react';
import CTextField from '../CTextField/CTextField';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import CSwitch from '../CSwitch/CSwitch';
import {  updateInventory } from '../../feature/inventorySlice';
import CSelect from '../CSelect/CSelect';

const EditInventory = (props) => {
  const dispatch = useDispatch();
  const [inventoryData, setInventoryData] = useState({
    id: props.data.id,
    ediStdNomenclature: props.data.ediStdNomenclature,
    aiscManualLabel: props.data.aiscManualLabel,
    weight: props.data.weight,
    depth: props.data.depth,
    grade: props.data.grade,
    poNumber: props.data.poNumber,
    heatNumber: props.data.heatNumber,
    itemType: props.data.itemType,
    lengthReceivedFoot: props.data.lengthReceivedFoot,
    lengthReceivedInch: props.data.lengthReceivedInch,
    quantity: props.data.quantity,
    poPulledFromNumber: props.data.poPulledFromNumber,
    lengthUsedFoot: props.data.lengthUsedFoot,
    lengthUsedInch: props.data.lengthUsedInch,
    lengthRemainingFoot: props.data.lengthRemainingFoot,
    lengthRemainingInch: props.data.lengthRemainingInch,
  });
  const [orderArrivedInFull, setOrderArrivedInFull] = useState(props.data.orderArrivedInFull);
  const [orderArrivedCMTR, setOrderArrivedCMTR] = useState(props.data.orderArrivedCMTR);
  const shapeData = ['2L', 'C', 'HP', 'HSS', 'L', 'M', 'MC', 'MT', 'PIPE', 'S', 'ST', 'W', 'WT'];
  const [itemType, setItemType] = useState(props.data.itemType);
  const selectItemType = ['stock', 'job'];
  const [selectShape, setSelectedShape] = useState(props.data.shape);
  const handleChange = (event) => {
    setInventoryData((prv) => ({ ...prv, [event.target.name]: event.target.value }));
  };

  const handleSubmit = () => {
    const shape = selectShape;
    let finalData = { ...inventoryData, orderArrivedCMTR, orderArrivedInFull, shape, itemType };
    dispatch(updateInventory(finalData)).then((res) => {
      if (res.type === 'updateInventorys/Inventory/fulfilled') {
        props.setOpen(false);
      }
    });
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
        <p>Edit Inventory</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        <CTextField
          defaultValue={inventoryData.ediStdNomenclature}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="ediStdNomenclature"
          label="EdiStd Nomen Clature"
        />
        <CTextField
          defaultValue={inventoryData.aiscManualLabel}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="aiscManualLabel"
          label="Aisc Manual Label"
        />
        <CSelect
          margin="5px 0px"
          width="310px"
          data={shapeData}
          label="Select Shape"
          initialValue={selectShape}
          setinitialValue={setSelectedShape}
        />
        <CTextField
          defaultValue={inventoryData.weight}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          type={'Number'}
          name="weight"
          label="Weight"
        />
        <CTextField
          defaultValue={inventoryData.depth}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="depth"
          label="Depth"
        />
        <CTextField
          defaultValue={inventoryData.grade}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="grade"
          label="Grade"
        />
        <CTextField
          defaultValue={inventoryData.poNumber}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="poNumber"
          label="Po Number"
        />
        <CTextField
          defaultValue={inventoryData.heatNumber}
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
          defaultValue={inventoryData.lengthReceivedFoot}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="lengthReceivedFoot"
          label="Length Received Foot"
          type={'Number'}
        />
        <CTextField
          defaultValue={inventoryData.lengthReceivedInch}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="lengthReceivedInch"
          label="Length Received Inch"
          type={'Number'}
        />
        <CTextField
          defaultValue={inventoryData.quantity}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="quantity"
          label="Quantity"
          type={'Number'}
        />
        <CTextField
          defaultValue={inventoryData.poPulledFromNumber}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="poPulledFromNumber"
          label="Po Pulled From Number"
        />
        <CTextField
          defaultValue={inventoryData.lengthUsedFoot}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="lengthUsedFoot"
          label="Length Used Foot"
          type={'Number'}
        />
        <CTextField
          defaultValue={inventoryData.lengthUsedInch}
          margin="5px 0px"
          width={300}
          fullWidth={false}
          onChange={handleChange}
          name="lengthUsedInch"
          label="Length Used Inch"
          type={'Number'}
        />
        <CTextField
          defaultValue={inventoryData.lengthRemainingFoot}
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
          defaultValue={props.lengthRemainingInch}
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

export default EditInventory;
