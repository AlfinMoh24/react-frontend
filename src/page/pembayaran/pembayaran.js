import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import useResizeObserver from '../../hook/useResizeObserver';

DataTable.use(DT);

const PembayaranPage = () => {
    const navigate = useNavigate();
    const [pemasukanData, setPemasukanData] = useState([]);
    const [pengeluaranData, setPengeluaranData] = useState([]);
    const [pembayaranData, setPembayaranData] = useState([]);
    const [totalPemasukanBulanIni, setTotalPemasukanBulanIni] = useState(0);
    const [totalPengeluaranBulanIni, setTotalPengeluaranBulanIni] = useState(0);
    const [totalSaldo, setTotalSaldo] = useState(0);
    const [filterBulan, setFilterBulan] = useState(1);
    const [filterTahun, setFilterTahun] = useState(2025);
    const [loading, setLoading] = useState(true);

    // Mengambil data dari API
    useEffect(() => {
        setLoading(true); // Pastikan loading diaktifkan sebelum request

        Promise.all([
            axios.get('http://localhost:8000/api/pemasukan'),
            axios.get('http://localhost:8000/api/pengeluaran'),
            axios.get('http://localhost:8000/api/pembayaran')
        ])
            .then(([pemasukanRes, pengeluaranRes, pembayaranRes]) => {
                console.log("Pemasukan:", pemasukanRes.data);
                console.log("Pengeluaran:", pengeluaranRes.data);
                console.log("Pembayaran:", pembayaranRes.data);

                setPemasukanData(pemasukanRes.data.data);
                setPengeluaranData(pengeluaranRes.data.data);
                setPembayaranData(pembayaranRes.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data", error);
                setLoading(false);
            })

    }, []);
    useResizeObserver(() => {
        console.log('Resize observed!');
    });

    // Fungsi untuk memfilter pemasukan berdasarkan bulan dan tahun
    const filterPemasukan = useCallback(() => {
        return pemasukanData.filter(item => {
            const itemDate = new Date(item.tanggal);
            return itemDate.getMonth() + 1 === filterBulan && itemDate.getFullYear() === filterTahun;
        });
    }, [pemasukanData, filterBulan, filterTahun]);

    // Fungsi untuk memfilter pengeluaran berdasarkan bulan dan tahun
    const filterPengeluaran = useCallback(() => {
        return pengeluaranData.filter(item => {
            const itemDate = new Date(item.tanggal);
            return itemDate.getMonth() + 1 === filterBulan && itemDate.getFullYear() === filterTahun;
        });
    }, [pengeluaranData, filterBulan, filterTahun]);

    // Fungsi untuk memfilter pembayaran berdasarkan bulan dan tahun
    const filterPembayaran = useCallback(() => {
        return pembayaranData.filter(item => {
            const itemDate = new Date(item.tanggal);
            return itemDate.getMonth() + 1 === filterBulan && itemDate.getFullYear() === filterTahun;
        });
    }, [pembayaranData, filterBulan, filterTahun]);

    // Menghitung total saldo
    useEffect(() => {
        const totalPemasukanBulanIni = filterPemasukan().reduce((acc, item) => acc + parseFloat(item.jumlah), 0);
        const totalPengeluaranBulanIni = filterPengeluaran().reduce((acc, item) => acc + parseFloat(item.jumlah), 0);
        setTotalPemasukanBulanIni(totalPemasukanBulanIni);
        setTotalPengeluaranBulanIni(totalPengeluaranBulanIni);

        // Menghitung total saldo tanpa filter
        const totalPemasukanAllTime = pemasukanData.reduce((acc, item) => acc + parseFloat(item.jumlah), 0);
        const totalPengeluaranAllTime = pengeluaranData.reduce((acc, item) => acc + parseFloat(item.jumlah), 0);
        setTotalSaldo(totalPemasukanAllTime - totalPengeluaranAllTime);
    }, [filterBulan, filterTahun, filterPemasukan, filterPengeluaran, pemasukanData, pengeluaranData]);

    const columns = [
        { title: 'Nama Penghuni', data: 'penghuni.nama_lengkap' },
        { title: 'Jenis Pembayaran', data: 'jenis_pembayaran' },
        { title: 'Jumlah', data: 'jumlah' },
        { title: 'Tanggal', data: 'tanggal' },
        {
            title: 'Status',
            data: 'status_pembayaran',
            render: (data) => `<span class="badge ${data === 'Lunas' ? 'bg-success' : 'bg-warning'}">${data}</span>`
        },
        {
            title: 'Aksi',
            data: 'id',
            render: (data) => `
                <button class="btn btn-warning text-white fs-9 px-2 py-1" onclick="window.location.href='/edit-pembayaran/${data}'">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            `,
            orderable: false
        }
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
            <h3 className="mb-4 text-center">Daftar Pembayaran</h3>

            {/* Filter Bulan dan Tahun */}
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

            {/* Total Pemasukan, Pengeluaran, Saldo */}
            <div className="row row-gap-3 row-cols-1 row-cols-md-3 fs-8">
                <div className="col">
                    <div
                        className="card bg-light shadow-sm bg-white d-flex flex-column h-100 border-0"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/pemasukan')}
                    >
                        <div className="card-body flex-grow-1 p-4">
                            <i className="fa-solid fa-wallet mb-3 fs-5 text-temp"></i>
                            <p className="card-title">Total Pemasukan Bulanan</p>
                            <p className="card-text fw-bold fs-6">Rp {totalPemasukanBulanIni.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div
                        className="card bg-light shadow-sm bg-white d-flex flex-column h-100 border-0"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/pengeluaran')}
                    >
                        <div className="card-body flex-grow-1 p-4">
                            <i className="fa-solid fa-wallet mb-3 fs-5 text-temp"></i>
                            <p className="card-title">Total Pengeluaran Bulanan</p>
                            <p className="card-text fw-bold fs-6">Rp {totalPengeluaranBulanIni.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card bg-light shadow-sm bg-white d-flex flex-column h-100 border-0 ">
                        <div className="card-body flex-grow-1 d-flex flex-column justify-content-center">
                            <h5 className="card-title">Saldo</h5>
                            <p className="card-text">Rp {totalSaldo.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* DataTable Pembayaran */}
            <div className="card shadow-sm mt-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0">Tabel Pembayaran</h6>
                    <button className="btn btn-primary fs-9" onClick={() => navigate('/tambah-pembayaran')}>
                        <i className="fa-solid fa-circle-plus me-2"></i>Tambah Pembayaran
                    </button>
                </div>
                <div className="card-body fs-8">
                    <div className="table-responsive">
                        <DataTable
                            data={filterPembayaran()}
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
                </div>
            </div>
        </div>
    );
};

export default PembayaranPage;
