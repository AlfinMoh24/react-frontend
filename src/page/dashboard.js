import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState("01");
    const [selectedYear, setSelectedYear] = useState("2025");
    const [data, setData] = useState({});
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];


    useEffect(() => {

        Promise.all([
            axios.get("http://localhost:8000/api/penghuni"),
            axios.get("http://localhost:8000/api/rumah"),
            axios.get("http://localhost:8000/api/pembayaran"),
            axios.get("http://localhost:8000/api/pemasukan"),
            axios.get("http://localhost:8000/api/pengeluaran"),
        ])
            .then(([penghuniRes, rumahRes, pembayaranRes, pemasukanRes, pengeluaranRes]) => {
                const penghuni = penghuniRes.data.data.length;
                const rumah = rumahRes.data.data.length;
                const pembayaran = pembayaranRes.data.data.length;

                // Hitung jumlah pembayaran lunas dan belum lunas
                const lunas = pembayaranRes.data.data.filter((item) => item.status_pembayaran === "Lunas").length;
                const belumLunas = pembayaran - lunas;

                // Hitung pemasukan, pengeluaran, dan saldo
                const pemasukan = pemasukanRes.data.data.reduce((acc, curr) => acc + parseFloat(curr.jumlah), 0);
                const pengeluaran = pengeluaranRes.data.data.reduce((acc, curr) => acc + parseFloat(curr.jumlah), 0);

                const saldo = pemasukan - pengeluaran;

                // Data untuk chart
                let pemasukanData = pemasukanRes.data.data;
                let pengeluaranData = pengeluaranRes.data.data;

                // Fungsi untuk menormalisasi format tanggal (yyyy-mm-dd)
                const normalizeDate = (dateString) => {
                    return dateString.split("T")[0];  // Ambil hanya bagian tanggal (yyyy-mm-dd)
                };

                // Filter berdasarkan bulan dan tahun yang dipilih
                const filterByMonthYear = (data) => {
                    return data.filter((item) => {
                        const [year, month] = normalizeDate(item.tanggal).split("-");
                        return year === selectedYear && month === selectedMonth;
                    });
                };

                let filteredPemasukan = filterByMonthYear(pemasukanData);
                let filteredPengeluaran = filterByMonthYear(pengeluaranData);

                // Mengurutkan data berdasarkan tanggal
                filteredPemasukan.sort((a, b) => new Date(normalizeDate(a.tanggal)) - new Date(normalizeDate(b.tanggal)));
                filteredPengeluaran.sort((a, b) => new Date(normalizeDate(a.tanggal)) - new Date(normalizeDate(b.tanggal)));

                // Menggabungkan semua tanggal unik dari pemasukan dan pengeluaran
                const allDates = [...new Set([...filteredPemasukan.map(d => normalizeDate(d.tanggal)), ...filteredPengeluaran.map(d => normalizeDate(d.tanggal))])].sort((a, b) => new Date(a) - new Date(b));

                // Membuat mapping pemasukan dan pengeluaran berdasarkan tanggal
                const pemasukanMap = Object.fromEntries(filteredPemasukan.map(d => [normalizeDate(d.tanggal), parseFloat(d.jumlah)]));
                const pengeluaranMap = Object.fromEntries(filteredPengeluaran.map(d => [normalizeDate(d.tanggal), parseFloat(d.jumlah)]));


                // Menyiapkan data untuk Chart.js
                const chartData = {
                    labels: allDates,
                    datasets: [
                        {
                            label: "Pemasukan",
                            data: pemasukanMap,
                            borderColor: "#4141ff",
                            backgroundColor: "#4141ff",
                            tension: 0.3,
                        },
                        {
                            label: "Pengeluaran",
                            data: pengeluaranMap,
                            borderColor: "#ff5454",
                            backgroundColor: "#ff5454",
                            tension: 0.3,
                        },
                    ],
                };

                // Set data yang digunakan dalam komponen
                setData({
                    jumlahPenghuni: penghuni,
                    jumlahRumah: rumah,
                    jumlahPembayaran: pembayaran,
                    jumlahLunas: lunas,
                    jumlahBelumLunas: belumLunas,
                    pemasukan,
                    pengeluaran,
                    saldo,
                    chartData,  // Menambahkan chartData
                });
            })
            .catch((error) => {
                console.error("Error fetching data", error);
            })
    }, [selectedMonth, selectedYear]); // Effect akan dijalankan setiap kali bulan atau tahun berubah

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "bottom",
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Tanggal",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Jumlah (Rp)",
                },
            },
        },
    };

    // Pastikan chartData ada sebelum di-render
    if (!data.chartData) {
        return <div className="text-center mt-4 container">
            <div className="spinner-border"></div>
            <p>Memuat data...</p>
        </div>;
    }
    // if (loading) {
    //     return (
    //         <div className="text-center mt-4 container">
    //             <div className="spinner-border"></div>
    //             <p>Memuat data...</p>
    //         </div>
    //     );
    // }
    return (
        <div className="mt-4">
            <div className="card-container">
                <div className="card-content shadow-sm bg-white">
                    <div className="d-flex gap-3 justify-content-between">
                        <div className="d-flex flex-column">
                            <div className="card-info-1">Penghuni</div>
                            <div className="card-info-2">{data.jumlahPenghuni}</div>
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="fa-solid fa-users"></i>
                        </div>
                    </div>
                </div>
                <div className="card-content shadow-sm bg-white">
                    <div className="d-flex gap-3 justify-content-between">
                        <div className="d-flex flex-column">
                            <div className="card-info-1">Rumah</div>
                            <div className="card-info-2">{data.jumlahRumah}</div>
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="fa-solid fa-house"></i>
                        </div>
                    </div>
                </div>
                <div className="card-content shadow-sm bg-white">
                    <div className="d-flex gap-3 justify-content-between">
                        <div className="d-flex flex-column">
                            <div className="card-info-1">Total Pembayaran</div>
                            <div className="card-info-2">{data.jumlahPembayaran}</div>
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="fa-solid fa-hand-holding-dollar"></i>
                        </div>
                    </div>
                </div>
                <div className="card-content shadow-sm bg-white">
                    <div className="d-flex gap-3 justify-content-between">
                        <div className="d-flex flex-column">
                            <div className="card-info-1">Lunas</div>
                            <div className="card-info-2">{data.jumlahLunas}</div>
                        </div>
                        <div className="d-flex align-items-center">
                            <i className="fa-solid fa-clipboard-check"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex w-100 gap-3 mt-4">
                <div className="chart-container card shadow-sm">
                    <div className="card-header border-bootom">
                        <h6 className="card-title">Statistika</h6>
                    </div>
                    <div className=" d-flex gap-1 px-3 py-2 fs-8">
                        
                        <select className="form-select" style={{ width: '120px' }} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            {monthNames.map((month, i) => (
                                <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                                    {month}
                                </option>
                            ))}
                        </select>

                        <select className="form-select" style={{ width: '100px' }} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                            {["2023", "2024", "2025"].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="px-3 pb-2">
                        {!data.chartData ? (
                            <p>Loading chart data...</p>
                        ) : (
                            <Line data={data.chartData} options={options} />
                        )}
                    </div>
                </div>
                <div className="info-pembayaran">
                    <div className="d-flex flex-column gap-3">
                        <div className="card-info rounded shadow-sm bg-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="flex-column">
                                    <span>Saldo :</span>
                                    <h6>Rp. {data.saldo.toLocaleString()} ,-</h6>
                                </div>
                                <div>
                                    
                                    <button className="btn-card-info" onClick={() => navigate('/pembayaran')}>Detail</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-info rounded shadow-sm bg-white">
                            <h6>Statistika Saldo</h6>
                            <div className="d-flex gap-2 align-items-center mt-4">
                                <i className="fa-solid fa-credit-card text-success"></i>
                                <div className="d-flex flex-column">
                                    <div className="fw-semibold">Pemasukan</div>
                                    <span>Rp. {data.pemasukan.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="d-flex gap-2 align-items-center mt-3">
                                <i className="fa-solid fa-money-bill text-danger"></i>
                                <div className="d-flex flex-column">
                                    <div className="fw-semibold">Pengeluaran</div>
                                    <span>Rp. {data.pengeluaran.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="d-flex gap-2 align-items-center mt-3">
                                <i className="fa-solid fa-circle-exclamation text-primary"></i>
                                <div className="d-flex flex-column">
                                    <div className="fw-semibold">Belum Lunas</div>
                                    <span>{data.jumlahBelumLunas.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


