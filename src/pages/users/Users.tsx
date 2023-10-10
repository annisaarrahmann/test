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
        width: 100,
    },
    {
        field: 'email',
        type: 'string',
        headerName: 'Email',
        width: 200,
    },
    {
        field: 'department',
        type: 'string',
        headerName: 'Jabatan',
        width: 150,
    },
];


const Users = () => {
    const [open, setOpen] = useState(false)

    const { isLoading, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch('http://localhost:8800/api/users').then((res) => res.json()),
    })
    return (
        <div className="users">
            <div className="info">
                <h1>Users</h1>
                <button onClick={()=>setOpen(true)}>Add New User</button>
            </div>
            {isLoading ? ("Loading ...") : (<DataTable slug="users" columns={columns} rows={data} />)}
            {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
        </div>
    )
}

export default Users