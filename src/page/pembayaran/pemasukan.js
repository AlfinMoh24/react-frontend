import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';

DataTable.use(DT);

const PemasukanPage = () => {
    const [pemasukanData, setPemasukanData] = useState([]);
    const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
    const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch data
    useEffect(() => {
        axios.get('http://localhost:8000/api/pemasukan')
            .then(response => {
                setPemasukanData(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching pemasukan data", error);
                setLoading(false);
            });
    }, []);

    // Filter pemasukan berdasarkan bulan dan tahun
    const filterPemasukan = () => {
        return pemasukanData.filter(item => {
            const itemDate = new Date(item.tanggal);
            return itemDate.getMonth() + 1 === filterBulan && itemDate.getFullYear() === filterTahun;
        });
    };

    // Hitung total pemasukan
    const totalPemasukan = () => {
        return filterPemasukan().reduce((total, item) => total + parseFloat(item.jumlah), 0);
    };

    const columns = [
        { title: 'Jenis Pemasukan', data: 'jenis_pemasukan' },
        { title: 'Jumlah', data: 'jumlah' },
        { title: 'Tanggal', data: 'tanggal', render: (data) => new Date(data).toLocaleDateString('id-ID') }
    ];

    if (loading) {
        return (
            <div className="text-center mt-4 container">
                <div className="spinner-border"></div>
                <p>Memuat data...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h4 className="mb-4 text-center">Daftar Pemasukan</h4>

            <div className="row mb-4 fs-8">
                <div className="col-md-6">
                    <label className="mr-2">Bulan:</label>
                    <select
                        className="form-control"
                        value={filterBulan}
                        onChange={e => setFilterBulan(parseInt(e.target.value))}
                    >
                        {[...Array(12).keys()].map(i => (
                            <option key={i} value={i + 1}>
                                {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="mr-2">Tahun:</label>
                    <select
                        className="form-control"
                        value={filterTahun}
                        onChange={e => setFilterTahun(parseInt(e.target.value))}
                    >
                        {[2025, 2024, 2023].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabel Pemasukan */}
            <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0">Daftar Pemasukan</h6>
                    {/* Tombol Tambah Pemasukan */}
                    <button
                        className="btn btn-primary fs-9"
                        onClick={() => navigate('/tambah-pemasukan')}
                    >
                        <i className="fa-solid fa-circle-plus me-2"></i>
                        Tambah Pemasukan
                    </button>
                </div>
                <div className="card-body fs-8">
                    <div className="table-responsive">
                        <DataTable
                            data={filterPemasukan()}
                            columns={columns}
                            options={{
                                responsive: true,
                                paging: true,
                                searching: true,
                                ordering: true,
                                info: true,
                                language: { search: "" }
                            }}
                            className="table table-striped table-bordered"
                        />
                    </div>

                    <div className="d-flex justify-content-end mt-3 me-2">
                        <h6>Total Pemasukan: Rp {totalPemasukan().toFixed(2)}</h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PemasukanPage;
