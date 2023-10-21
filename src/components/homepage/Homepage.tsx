import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable"
import "./homepage.scss"
import { userRows } from "../../data";
import Add from "../../components/add/Add";
import { useState } from "react";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'tanggal',
        type: 'string',
        headerName: 'Tanggal',
        width: 100,
    },
    {
        field: 'nomorSurat',
        type: 'string',
        headerName: 'Nomor Surat',
        width: 200,
    },
    {
        field: 'perihal',
        type: 'string',
        headerName: 'Perihal',
        width: 150,
    },
    {
        field: 'tujuan',
        type: 'string',
        headerName: 'Diajukan Kepada',
        width: 150,
    },
    {
        field: 'dasar',
        type: 'string',
        headerName: 'Dasar Surat',
        width: 150,
    },
];

const Homepage = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className="homepage">
            <div className="info">
                <h1>Surat Terkini</h1>
            </div>
            <DataTable slug="homepage" columns={columns} rows={userRows} />
            {open && <Add slug="homepage" columns={columns} setOpen={setOpen} />}
        </div>
    )
}

export default Homepage