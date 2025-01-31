import React from "react";
import Layout from './page/layout';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Penghuni from './page/penghuni/penghuni';
import TambahPenghuni from './page/penghuni/TambahPenghuni';
import DetailPenghuni from './page/penghuni/DetailPenghuni';
import EditPenghuni from './page/penghuni/editPenghuni';
import ListRumah from './page/rumah/rumah';
import DetailRumah from './page/rumah/DetailRumah';
import TambahRumah from './page/rumah/TambahRumah';
import TambahPenghuniRumah from './page/rumah/TambahPenghuniRumah';
import EditPenghuniRumah from './page/rumah/EditPenghuniRumah';
import EditRumah from './page/rumah/EditRumah';
import Pembayaran from './page/pembayaran/pembayaran';
import TambahPembayaran from './page/pembayaran/tambahPembayaran';
import EditPembayaran from './page/pembayaran/EditPembayaran';
import PemasukanPage from './page/pembayaran/pemasukan';
import PengeluaranPage from './page/pembayaran/pengeluaran';
import TambahPemasukan from './page/pembayaran/tambahPemasukan';
import TambahPengeluaran from './page/pembayaran/tambahPengleuaran';
import RekapPembayaran from './page/rumah/rekapPembayaran';
import Dashboard from "./page/dashboard";

const App = () => {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/penghuni" element={<Penghuni />} />
          <Route path="/tambah-penghuni" element={<TambahPenghuni />} />
          <Route path="/penghuni/:id" element={<DetailPenghuni />} />
          <Route path="/penghuni/edit/:id" element={<EditPenghuni />} />
          <Route path="/rumah" element={<ListRumah />} />
          <Route path="/rumah/:id" element={<DetailRumah />} />
          <Route path="/tambah-rumah" element={<TambahRumah />} />
          <Route path="/rumah/tambah-penghuni/:id" element={<TambahPenghuniRumah />} />
          <Route path="/rumah/edit-penghuni/:id" element={<EditPenghuniRumah />} />
          <Route path="/rumah/edit-rumah/:id" element={<EditRumah />} />
          <Route path="/pembayaran" element={<Pembayaran />} />
          <Route path="/tambah-pembayaran" element={<TambahPembayaran />} />
          <Route path="/edit-pembayaran/:id" element={<EditPembayaran />} />
          <Route path="/pemasukan" element={<PemasukanPage />} />
          <Route path="/pengeluaran" element={<PengeluaranPage />} />
          <Route path="/tambah-pemasukan" element={<TambahPemasukan />} />
          <Route path="/tambah-pengeluaran" element={<TambahPengeluaran />} />
          <Route path="/pembayaran/rumah/:id" element={<RekapPembayaran />} />
        </Routes>
      </Layout>
    </Router>
  );
};


export default App;
