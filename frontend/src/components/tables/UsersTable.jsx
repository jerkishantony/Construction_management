import { useState } from "react";
import {
  Card,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  Skeleton,
  Collapse,
  Divider,
  ButtonBase,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { DataGrid } from "@mui/x-data-grid";

export default function UsersTable({
  users = [],
  loading,
  onEdit,
  onDelete,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const columns = [
    { field: "company_name", headerName: "Company", flex: 1.2, minWidth: 120 },
    {
      field: "full_name",
      headerName: "User",
      flex: 1.4,
      minWidth: 170,
      renderCell: (params) => (
        <Box sx={{ lineHeight: 1.3, py: 0.5 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {params.row.full_name || "-"}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            @{params.row.username}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Contact",
      flex: 1.6,
      minWidth: 190,
      renderCell: (params) => (
        <Box sx={{ lineHeight: 1.3, py: 0.5 }}>
          <Typography variant="body2" noWrap>{params.row.email}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.phone || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role / Plan",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Chip label={params.value} color={params.value === "admin" ? "secondary" : "primary"} size="small" />
          <Chip label={params.row.plan || "-"} color="info" size="small" variant="outlined" />
        </Stack>
      ),
    },
    {
      field: "is_active",
      headerName: "Status",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <Chip label={params.value ? "Active" : "Inactive"} color={params.value ? "success" : "error"} size="small" />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit User">
            <IconButton color="primary" onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton color="error" onClick={() => onDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  // ---------------- MOBILE VIEW (< 600px): compact expandable list ----------------
  if (isMobile) {
    if (loading) {
      return (
        <Stack spacing={1}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rounded" height={64} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      );
    }

    if (users.length === 0) {
      return (
        <Card sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
          <Typography color="text.secondary">No users found.</Typography>
        </Card>
      );
    }

    return (
      <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
        {users.map((user, idx) => {
          const isExpanded = expandedId === user.id;

          return (
            <Box key={user.id}>
              {idx > 0 && <Divider />}

              {/* Compact summary row - always visible */}
              <ButtonBase
                onClick={() => toggleExpand(user.id)}
                sx={{
                  width: "100%",
                  display: "block",
                  textAlign: "left",
                  px: 1.5,
                  py: 1,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {user.full_name || "-"}
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.75 }}>
                        @{user.username}
                      </Typography>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {user.company_name || "-"}
                    </Typography>
                  </Box>

                  <Chip
                    label={user.is_active ? "Active" : "Inactive"}
                    color={user.is_active ? "success" : "error"}
                    size="small"
                    sx={{ flexShrink: 0 }}
                  />

                  <ExpandMoreIcon
                    fontSize="small"
                    sx={{
                      flexShrink: 0,
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      color: "text.secondary",
                    }}
                  />
                </Stack>
              </ButtonBase>

              {/* Expanded details */}
              <Collapse in={isExpanded}>
                <Box sx={{ px: 1.5, pb: 1.5, pt: 0.5, bgcolor: "#fafafa" }}>
                  <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                    {user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.phone || "-"}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={user.role}
                      color={user.role === "admin" ? "secondary" : "primary"}
                      size="small"
                    />
                    <Chip label={user.plan || "-"} color="info" size="small" variant="outlined" />
                  </Stack>

                  <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
                    <IconButton color="primary" size="small" onClick={() => onEdit(user)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => onDelete(user)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Card>
    );
  }

  // ---------------- DESKTOP / TABLET VIEW (>= 600px): DataGrid ----------------
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden", width: "100%" }}>
      <DataGrid
        autoHeight
        rowHeight={60}
        rows={users}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        disableColumnMenu
        pageSizeOptions={[5, 10, 20, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5", fontWeight: 700, fontSize: 14 },
          "& .MuiDataGrid-cell": { fontSize: 14, display: "flex", alignItems: "center" },
          "& .MuiDataGrid-row:hover": { backgroundColor: "#fafafa" },
        }}
      />
    </Card>
  );
}