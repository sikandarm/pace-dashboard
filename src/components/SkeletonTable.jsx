import React from 'react';
import { TableCell, TableRow, Skeleton } from '@mui/material';

const SkeletonTable = ({ numColumns }) => {
  const skeletonCells = Array.from({ length: numColumns }, (_, index) => (
    <TableCell key={index}>
      <Skeleton />
    </TableCell>
  ));

  return <TableRow>{skeletonCells}</TableRow>;
};

export default SkeletonTable;
