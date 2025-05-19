import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = () => {
  const [list, setList] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    category: ''
  })

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data)
    } else {
      toast.error("Error fetching items")
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
    await fetchList()
    if (response.data.success) {
      toast.success(response.data.message)
    } else {
      toast.error("Error removing item")
    }
  }

  const startEditing = (item) => {
    setEditingItem(item._id)
    setEditForm({
      name: item.name,
      price: item.price,
      category: item.category
    })
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setEditForm({
      name: '',
      price: '',
      category: ''
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const saveEdit = async () => {
    try {
      const response = await axios.post(`${url}/api/food/update`, {
        id: editingItem,
        ...editForm
      })
      
      if (response.data.success) {
        toast.success("Item updated successfully")
        await fetchList()
        cancelEditing()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Error updating item")
      console.error(error)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/` + item.image} alt="" />
            
            {editingItem === item._id ? (
              <>
                <input 
                  type="text" 
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
                <select 
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                >
                  <option value="Pickles">Pickles</option>
                  <option value="Traditional Snacks">Traditional Snacks</option>
                  <option value="Spice powders">Spice powders</option>
                  <option value="Papads and Fryums">Papads and Fryums</option>
                  <option value="Homemade sweets">Homemade sweets</option>
                  <option value="Healthy bites">Healthy bites</option>
                </select>
                <input 
                  type="number" 
                  name="price"
                  value={editForm.price}
                  onChange={handleEditChange}
                />
              </>
            ) : (
              <>
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{currency}{item.price}</p>
              </>
            )}
            
            <div className="action-buttons">
              {editingItem === item._id ? (
                <>
                  <button onClick={saveEdit} className="save-btn">Save</button>
                  <button onClick={cancelEditing} className="cancel-btn">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEditing(item)} className="edit-btn">Edit</button>
                  <p onClick={() => removeFood(item._id)} className='cursor'>×</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List