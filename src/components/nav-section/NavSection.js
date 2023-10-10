import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import { hasNavPermission } from '../../utils/hasPermission';
import { useSelector } from 'react-redux';

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  const { loginUser } = useSelector((state) => state.userSlice);

  const { permissions: userPermissions } = loginUser.decodedToken;

  const filteredMenuItems = data.filter((item) => {
    if (!item.requiredPermission) return true;
    return hasNavPermission(userPermissions, item.requiredPermission);
  });
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {filteredMenuItems.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
