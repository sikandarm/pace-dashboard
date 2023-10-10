import { toast } from 'react-toastify';
export const validateionInverntory = (data) => {
  console.log(data);
  if (data.aiscManualLabel === '' || data.aiscManualLabel.length <= 0) {
    toast('Aisc manual label should not be empty.');
    return false;
  }
  if (data.aiscManualLabel.length > 50) {
    toast('Aisc manual max length is 50.');
    return false;
  }
  if (data.itemType === '' || data.itemType === 'undefined') {
    toast('Please Select Item type.');
    return false;
  }
  if (data.ediStdNomenclature === '' || data.ediStdNomenclature.length <= 0) {
    toast('Edi Std Nomen Clature should not be empty.');
    return false;
  }
  if (data.ediStdNomenclature.length > 50) {
    toast('Edi Std Nomen Clature max length is 50.');
    return false;
  }
  if (data.weight === '' || data.weight.length <= 0) {
    toast('Weight should not be empty.');
    return false;
  }
  if (data.weight.length > 10) {
    toast('Weight max length is 10.');
    return false;
  }
  if (data.depth === '' || data.depth.length <= 0) {
    toast('Depth should not be empty.');
    return false;
  }
  if (data.depth.length > 10) {
    toast('Depth max length is 10.');
    return false;
  }
  if (data.grade === '' || data.grade.length < 5) {
    toast('Grade should not be empty and min length 5.');
    return false;
  }
  if (data.grade.length > 10) {
    toast('Grade max length is 10.');
    return false;
  }
  if (data.poNumber === '' || data.poNumber.length < 5) {
    toast('PO Number should not be empty and min length is 5.');
    return false;
  }
  if (data.poNumber.length > 10) {
    toast('PO Number max length is 10.');
    return false;
  }

  if (data.heatNumber === '' || data.heatNumber.length < 5) {
    toast('Heat Number should not be empty and min length is 5.');
    return false;
  }
  if (data.heatNumber.length > 10) {
    toast('Heat Number max length is 50.');
    return false;
  }

  if (data.poNumber === '' || data.poNumber.length <= 0) {
    toast('PO Number should not be empty.');
    return false;
  }
  if (data.poNumber.length > 10) {
    toast('PO Number max length is 50.');
    return false;
  }

  if (data.lengthReceivedFoot === '' || data.lengthReceivedFoot.length <= 0) {
    toast('Length Received Foot should not be empty.');
    return false;
  }
  if (data.lengthReceivedFoot > 99) {
    toast('Length Received Foot max length is 99.');
    return false;
  }

  if (data.lengthReceivedInch === '' || data.lengthReceivedInch.length <= 0) {
    toast('Length Received Inch should not be empty.');
    return false;
  }
  if (data.lengthReceivedInch > 99) {
    toast('Length Received Inch max length is 99.');
    return false;
  }

  if (data.quantity === '' || data.quantity.length <= 0) {
    toast('Quantity should not be empty.');
    return false;
  }
  if (data.quantity > 100) {
    toast('Quantity max length is 100.');
    return false;
  }

  if (data.poPulledFromNumber === '' || data.poPulledFromNumber.length < 5) {
    toast('Po Pulled From Number should not be empty and min length is 5.');
    return false;
  }
  if (data.poPulledFromNumber.length > 10) {
    toast('Po Pulled From Number max length is 10.');
    return false;
  }
  if (data.lengthUsedFoot === '' || data.lengthUsedFoot.length <= 0) {
    toast('Length Used Foot should not be empty.');
    return false;
  }
  if (data.lengthUsedFoot > 99) {
    toast('Length Used Foot max length is 99.');
    return false;
  }
  if (data.lengthUsedInch === '' || data.lengthUsedInch.length <= 0) {
    toast('Length Used Inch should not be empty.');
    return false;
  }
  if (data.lengthUsedInch > 99) {
    toast('Length Used Inch max length is 99.');
    return false;
  }
  if (data.lengthRemainingFoot === '' || data.lengthRemainingFoot.length <= 0) {
    toast('Length Remaining Foot should not be empty.');
    return false;
  }
  if (data.lengthRemainingFoot > 99) {
    toast('Length Remaining Foot max length is 99.');
    return false;
  }
  if (data.lengthRemainingInch === '' || data.lengthRemainingInch.length <= 0) {
    toast('Length Remaining Inch should not be empty.');
    return false;
  }
  if (data.lengthRemainingInch > 99) {
    toast('Length Remaining Inch max length is 99.');
    return false;
  }
  return true;
};
