import { useMemo } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Paper,
  TableContainer,
} from "@mui/material";

const COLUMNS = [
  { field: "can_view", label: "View" },
  { field: "can_create", label: "Create" },
  { field: "can_edit", label: "Edit" },
  { field: "can_delete", label: "Delete" },
];

export default function PermissionTable({
  menus,
  permissions,
  onPermissionChange,
}) {
  const getMenuId = (menu) => menu.id ?? menu.menu_id;

  const getPermission = (menuId) =>
    permissions[menuId] || {
      can_view: false,
      can_create: false,
      can_edit: false,
      can_delete: false,
    };

  // For each column, figure out if every row is currently checked
  const columnState = useMemo(() => {
    const state = {};
    COLUMNS.forEach(({ field }) => {
      state[field] =
        menus.length > 0 &&
        menus.every((menu) => getPermission(getMenuId(menu))[field]);
    });
    return state;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus, permissions]);

  const handleSelectAll = (field) => {
    const allChecked = columnState[field];
    const target = !allChecked;

    menus.forEach((menu) => {
      const menuId = getMenuId(menu);
      const current = getPermission(menuId)[field];
      // onPermissionChange toggles the value, so only call it
      // for rows that don't already match the target state
      if (current !== target) {
        onPermissionChange(menuId, field);
      }
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Menu</strong>
            </TableCell>

            {COLUMNS.map(({ field, label }) => (
              <TableCell align="center" key={field}>
                <strong>{label}</strong>
                <Checkbox
                  size="small"
                  checked={columnState[field]}
                  onChange={() => handleSelectAll(field)}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {menus.map((menu) => {
            // Support either shape: { id, name } from /admin/menus/all
            // or { menu_id, menu_name } from /admin/permissions/:userId
            const menuId = getMenuId(menu);
            const menuName = menu.name ?? menu.menu_name;
            const permission = getPermission(menuId);

            return (
              <TableRow key={menuId} hover>
                <TableCell>{menuName}</TableCell>

                {COLUMNS.map(({ field }) => (
                  <TableCell align="center" key={field}>
                    <Checkbox
                      checked={permission[field]}
                      onChange={() => onPermissionChange(menuId, field)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}