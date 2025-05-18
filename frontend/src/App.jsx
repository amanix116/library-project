import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [publishers, setPublishers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);

  const [bookForm, setBookForm] = useState({ title: '', isbn: '', publisher_id: '', supplier_id: '' });
  const [publisherForm, setPublisherForm] = useState({ name: '', contact: '' });
  const [supplierForm, setSupplierForm] = useState({ name: '', contact: '' });
  const [memberForm, setMemberForm] = useState({ name: '', role: '' });
  const [borrowForm, setBorrowForm] = useState({ bookid: '', member_id: '', borrow_date: '', return_date: '' });

  const fetchAll = async () => {
    const [pub, sup, mem, bok, bor] = await Promise.all([
      fetch('http://localhost:3000/publishers').then(r => r.json()),
      fetch('http://localhost:3000/suppliers').then(r => r.json()),
      fetch('http://localhost:3000/members').then(r => r.json()),
      fetch('http://localhost:3000/books').then(r => r.json()),
      fetch('http://localhost:3000/borrow').then(r => r.json()),
    ]);
    setPublishers(pub);
    setSuppliers(sup);
    setMembers(mem);
    setBooks(bok);
    setBorrows(bor);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e, setter) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e, endpoint, form, setter) => {
    e.preventDefault();
    await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setter({});
    fetchAll();
  };

  return (
    <div className='container' style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h3>📚 Library Management System</h3>

      <h2>Add Publisher</h2>
      <form onSubmit={e => handleSubmit(e, 'publishers', publisherForm, setPublisherForm)}>
        <input name="name" placeholder="Name" value={publisherForm.name || ''} onChange={e => handleChange(e, setPublisherForm)} />
        <input name="contact" placeholder="Contact" value={publisherForm.contact || ''} onChange={e => handleChange(e, setPublisherForm)} />
        <button>Add Publisher</button>
      </form>

      <h2>Add Supplier</h2>
      <form onSubmit={e => handleSubmit(e, 'suppliers', supplierForm, setSupplierForm)}>
        <input name="name" placeholder="Name" value={supplierForm.name || ''} onChange={e => handleChange(e, setSupplierForm)} />
        <input name="contact" placeholder="Contact" value={supplierForm.contact || ''} onChange={e => handleChange(e, setSupplierForm)} />
        <button>Add Supplier</button>
      </form>

      <h2>Add Member</h2>
      <form onSubmit={e => handleSubmit(e, 'members', memberForm, setMemberForm)}>
        <input name="name" placeholder="Name" value={memberForm.name || ''} onChange={e => handleChange(e, setMemberForm)} />
        <input name="role" placeholder="Role" value={memberForm.role || ''} onChange={e => handleChange(e, setMemberForm)} />
        <button>Add Member</button>
      </form>

      <h2>Add Book</h2>
      <form onSubmit={e => handleSubmit(e, 'books', bookForm, setBookForm)}>
        <input name="title" placeholder="Title" value={bookForm.title || ''} onChange={e => handleChange(e, setBookForm)} />
        <input name="isbn" placeholder="ISBN" value={bookForm.isbn || ''} onChange={e => handleChange(e, setBookForm)} />
        <select name="publisher_id" value={bookForm.publisher_id || ''} onChange={e => handleChange(e, setBookForm)}>
          <option value="">Select Publisher</option>
          {publishers.map(p => <option key={p.publisher_id} value={p.publisher_id}>{p.name}</option>)}
        </select>
        <select name="supplier_id" value={bookForm.supplier_id || ''} onChange={e => handleChange(e, setBookForm)}>
          <option value="">Select Supplier</option>
          {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>)}
        </select>
        <button>Add Book</button>
      </form>

      <h2>Borrow Book</h2>
      <form onSubmit={e => handleSubmit(e, 'borrow', borrowForm, setBorrowForm)}>
        <select name="bookid" value={borrowForm.bookid || ''} onChange={e => handleChange(e, setBorrowForm)}>
          <option value="">Select Book</option>
          {books.map(b => <option key={b.bookid} value={b.bookid}>{b.title}</option>)}
        </select>
        <select name="member_id" value={borrowForm.member_id || ''} onChange={e => handleChange(e, setBorrowForm)}>
          <option value="">Select Member</option>
          {members.map(m => <option key={m.member_id} value={m.member_id}>{m.name}</option>)}
        </select>
        <input type="date" name="borrow_date" value={borrowForm.borrow_date || ''} onChange={e => handleChange(e, setBorrowForm)} />
        <input type="date" name="return_date" value={borrowForm.return_date || ''} onChange={e => handleChange(e, setBorrowForm)} />
        <button>Borrow Book</button>
      </form>

      <h2>📖 Borrowed List</h2>
      <ul>
        {borrows.map((b, i) => (
          <li key={i}>{b.name} borrowed "{b.title}" from {b.borrow_date} to {b.return_date}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
