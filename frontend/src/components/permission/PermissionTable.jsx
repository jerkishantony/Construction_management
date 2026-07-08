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

export default function PermissionTable({
  menus,
  permissions,
  onPermissionChange,
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Menu</strong>
            </TableCell>

            <TableCell align="center">
              <strong>View</strong>
            </TableCell>

            <TableCell align="center">
              <strong>Create</strong>
            </TableCell>

            <TableCell align="center">
              <strong>Edit</strong>
            </TableCell>

            <TableCell align="center">
              <strong>Delete</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {menus.map((menu) => {
            // Support either shape: { id, name } from /admin/menus/all
            // or { menu_id, menu_name } from /admin/permissions/:userId
            const menuId = menu.id ?? menu.menu_id;
            const menuName = menu.name ?? menu.menu_name;

            const permission = permissions[menuId] || {
              can_view: false,
              can_create: false,
              can_edit: false,
              can_delete: false,
            };

            return (
              <TableRow key={menuId} hover>
                <TableCell>{menuName}</TableCell>

                <TableCell align="center">
                  <Checkbox
                    checked={permission.can_view}
                    onChange={() => onPermissionChange(menuId, "can_view")}
                  />
                </TableCell>

                <TableCell align="center">
                  <Checkbox
                    checked={permission.can_create}
                    onChange={() => onPermissionChange(menuId, "can_create")}
                  />
                </TableCell>

                <TableCell align="center">
                  <Checkbox
                    checked={permission.can_edit}
                    onChange={() => onPermissionChange(menuId, "can_edit")}
                  />
                </TableCell>

                <TableCell align="center">
                  <Checkbox
                    checked={permission.can_delete}
                    onChange={() => onPermissionChange(menuId, "can_delete")}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}