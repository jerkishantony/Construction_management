import {
  Card,
  Chip,
  Box,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  Skeleton,
  Divider,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

export default function MenuTable({
  menus = [],
  loading,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    {
      field: "menu_name",
      headerName: "Menu Name",
      flex: 1.5,
      minWidth: 220,
    },
    {
      field: "route",
      headerName: "Route",
      flex: 1.5,
      minWidth: 220,
    },
    {
      field: "icon",
      headerName: "Icon",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "is_active",
      headerName: "Status",
      flex: .8,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
  ];

  // ===========================
  // Mobile View
  // ===========================

  if (isMobile) {

    if (loading) {
      return (
        <Stack spacing={1}>
          {[1,2,3,4,5].map((i)=>(
            <Skeleton
              key={i}
              variant="rounded"
              height={70}
              sx={{borderRadius:2}}
            />
          ))}
        </Stack>
      );
    }

    if (menus.length === 0) {
      return (
        <Card
          sx={{
            p:3,
            borderRadius:3,
            textAlign:"center"
          }}
        >
          <Typography color="text.secondary">
            No menus found.
          </Typography>
        </Card>
      );
    }

    return (
      <Card
        sx={{
          borderRadius:3,
          boxShadow:2,
          overflow:"hidden",
        }}
      >
        {menus.map((menu,index)=>(
          <Box key={menu.id}>
            {index > 0 && <Divider />}

            <Box
              sx={{
                p:2,
              }}
            >
              <Typography
                fontWeight={700}
              >
                {menu.menu_name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{mt:.5}}
              >
                {menu.route}
              </Typography>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{mt:2}}
              >
                <Typography variant="body2">
                  Icon : {menu.icon}
                </Typography>

                <Chip
                  label={menu.is_active ? "Active" : "Inactive"}
                  color={menu.is_active ? "success":"error"}
                  size="small"
                />
              </Stack>
            </Box>
          </Box>
        ))}
      </Card>
    );
  }

  // ===========================
  // Desktop View
  // ===========================

  return (
    <Card
      sx={{
        borderRadius:3,
        boxShadow:3,
        overflow:"hidden",
      }}
    >
      <DataGrid
        autoHeight
        rowHeight={60}
        rows={menus}
        columns={columns}
        loading={loading}
        getRowId={(row)=>row.id}
        disableRowSelectionOnClick
        disableColumnMenu
        pageSizeOptions={[5,10,20]}
        initialState={{
          pagination:{
            paginationModel:{
              pageSize:10,
            },
          },
        }}
        sx={{
          border:0,
          "& .MuiDataGrid-columnHeaders":{
            background:"#f5f5f5",
            fontWeight:700,
          },
        }}
      />
    </Card>
  );
}