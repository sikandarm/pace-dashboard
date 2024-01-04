// component
import SvgColor from "../../../components/svg-color";
import PERMISSIONS from "../../../utils/permissionsConfig";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "dashboard",
    path: "/dashboard/app",
    icon: icon("ic_analytics"),
  },
  {
    title: "Permissions",
    path: "/permissions",
    icon: icon("ic_permission"),
    requiredPermission: [
      PERMISSIONS.VIEW_PERMISSION,
      PERMISSIONS.ADD_PERMISSION,
      PERMISSIONS.EXPORT_PERMISSION,
    ],
  },
  {
    title: "roles",
    path: "/roles",
    icon: icon("ic_role"),
    requiredPermission: [
      PERMISSIONS.VIEW_ROLE,
      PERMISSIONS.ADD_ROLE,
      PERMISSIONS.EXPORT_ROLE,
    ],
  },
  {
    title: "users",
    path: "/users",
    icon: icon("ic_user"),
    requiredPermission: [
      PERMISSIONS.VIEW_USER,
      PERMISSIONS.ADD_USER,
      PERMISSIONS.EXPORT_USER,
    ],
  },
  {
    title: "inventory",
    path: "/inventory",
    icon: icon("ic_inventory"),
    requiredPermission: [
      PERMISSIONS.VIEW_INVENTORY,
      PERMISSIONS.ADD_INVENTORY,
      PERMISSIONS.EXPORT_INVENTORY,
    ],
  },
  {
    title: "jobs",
    path: "/jobs",
    icon: icon("ic_job"),
    requiredPermission: [
      PERMISSIONS.VIEW_JOB,
      PERMISSIONS.ADD_JOB,
      PERMISSIONS.EXPORT_JOB,
    ],
  },
  {
    title: "Sequence",
    path: "/sequence",
    icon: icon("ic_sequence"),
    requiredPermission: [
      PERMISSIONS.ADD_SEQUENCE,
      PERMISSIONS.DELETE_SEQUENCE,
      PERMISSIONS.VIEW_SEQUENCE,
    ],
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: icon("ic_task"),
    requiredPermission: [
      PERMISSIONS.VIEW_TASK,
      PERMISSIONS.ADD_TASK,
      PERMISSIONS.EXPORT_TASK,
    ],
  },
  {
    title: "Contact",
    path: "/contacts",
    icon: icon("ic_contact"),
    requiredPermission: [
      PERMISSIONS.VIEW_CONTACT,
      PERMISSIONS.ADD_CONTACT,
      PERMISSIONS.EXPORT_CONTACT,
    ],
  },
  {
    title: "PurchaseOrder",
    path: "/purchaseorder",
    icon: icon("ic_po"),
    requiredPermission: [
      PERMISSIONS.ADD_PURCHASE,
      PERMISSIONS.EDIT_PURCHASE,
      PERMISSIONS.DELETE_PURCHASE,
    ],
  },
  {
    title: "Company",
    path: "/companies",
    icon: icon("ic_company"),
    requiredPermission: [
      PERMISSIONS.ADD_Company,
      PERMISSIONS.Edit_Company,
      PERMISSIONS.Delete_Company,
    ],
  },
  {
    title: "Vendor",
    path: "/vendors",
    icon: icon("ic_vendor"),
    requiredPermission: [
      PERMISSIONS.ADD_Company,
      PERMISSIONS.Edit_Company,
      PERMISSIONS.Delete_Company,
    ],
  },
];

export default navConfig;
