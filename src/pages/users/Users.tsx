import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable"
import "./users.scss"
import { userRows } from "../../data";
import Add from "../../components/add/Add";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'img',
        headerName: 'Avatar',
        width: 100,
        renderCell: (params) => {
            return <img src={params.row.img || "noavatar.png"} alt="" />
        }
    },
    {
        field: 'name',
        type: 'string',
        headerName: 'Name',
        width: 150,
    },
    {
        field: 'department',
        type: 'string',
        headerName: 'Jabatan',
        width: 250,
    },
];


const Users = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className="users">
            <div className="info">
                <h1>Users</h1>
            </div>
            <DataTable slug="users" columns={columns} rows={userRows} />
            {open && <Add slug="users" columns={columns} setOpen={setOpen} />}
        </div>
    )
}

export default Users