import { useState } from "react"
import "./products.scss"
import DataTable from "../../components/dataTable/DataTable"
import { GridColDef } from "@mui/x-data-grid";
import { products } from "../../data";
import Add from "../../components/add/Add";

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
        field: 'firstName',
        type: 'string',
        headerName: 'First Name',
        width: 100,
    },
    {
        field: 'lastName',
        type: 'string',
        headerName: 'Last Name',
        width: 100,
    },
    {
        field: 'email',
        type: 'string',
        headerName: 'Email',
        width: 200,
    },
    {
        field: 'phone',
        type: 'string',
        headerName: 'Phone',
        width: 200,
    },
    {
        field: 'verified',
        type: 'boolean',
        headerName: 'Verified',
        width: 150,
    },
];

const Products = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className="products">
            <div className="info">
                <h1>Products</h1>
                <button onClick={()=>setOpen(true)}>Add New Products</button>
            </div>
            <DataTable slug="products" columns={columns} rows={products} />
            {open && <Add slug="product" columns={columns} setOpen={setOpen} />}
        </div>
    )
}

export default Products