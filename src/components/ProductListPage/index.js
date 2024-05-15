import {useState, useEffect} from 'react'
import {
  Table,
  Button,
  message,
  Popconfirm,
  Input,
  Select,
  Modal,
  Form,
} from 'antd'
import './index.css'
import {Link} from 'react-router-dom'

const {Search} = Input
const {Option} = Select

const ProductListPage = () => {
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState()
  const [uniqueCategories, setUniqueCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  /*  */

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data)
        setTotalProducts(data.length)
        const categories = Array.from(
          new Set(data.map(product => product.category)),
        )
        setUniqueCategories(categories)
      })
      .catch(error => console.error('Error fetching products:', error))
  }, [])

  useEffect(() => {
    if (categoryFilter) {
      setFilteredProducts(
        products.filter(product => product.category === categoryFilter),
      )
    } else {
      setFilteredProducts(products)
    }
  }, [categoryFilter, products])

  const updateTotalProducts = () => {
    setTotalProducts(products.length)
  }

  const handleDelete = productId => {
    fetch(`https://fakestoreapi.com/products/${productId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setProducts(products.filter(product => product.id !== productId))
          updateTotalProducts(
            products.filter(product => product.id !== productId),
          )
          message.success('Product deleted successfully!')
        } else {
          message.error('Failed to delete product!')
        }
      })
      .catch(error => {
        console.error('Error deleting product:', error)
        message.error('Failed to delete product!')
      })
  }

  const handleEdit = productId => {
    const product = products.find(item => item.id === productId)
    setSelectedProduct(product)
    setEditModalVisible(true)
  }

  const handleEditModalCancel = () => {
    setEditModalVisible(false)
  }

  const handleEditFormSubmit = values => {
    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        return {...product, ...values}
      }
      return product
    })
    setProducts(updatedProducts)
    setFilteredProducts(updatedProducts)
    setEditModalVisible(false)
    message.success('Product updated successfully!')
  }

  const columns = [
    {title: 'Category', dataIndex: 'category', key: 'category'},
    {title: 'Name', dataIndex: 'title', key: 'title'},
    {title: 'Description', dataIndex: 'description', key: 'description'},
    {title: 'Price', dataIndex: 'price', key: 'price'},
    {
      title: 'Actions',
      dataIndex: '',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record.id)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const handleCategoryFilter = value => {
    setCategoryFilter(value)
  }

  const handleSearch = value => {
    setSearchTerm(value)
    if (!value) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        product =>
          product.title.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredProducts(filtered)
    }
  }

  return (
    <div className="product-list-container">
      <h1 className="product-list-head">Product List</h1>
      <div className="length-cat-cont">
        <p>
          Total Products: <span className="span-el">{totalProducts}</span>
        </p>
        <p>
          Unique Categories:{' '}
          <span className="span-el">{uniqueCategories.length}</span>{' '}
        </p>
      </div>
      <div
        className="search-product-btn-container"
        style={{marginBottom: '16px'}}
      >
        <div>
          <Select
            defaultValue="All"
            style={{width: 120, marginRight: '8px'}}
            onChange={handleCategoryFilter}
          >
            <Option value={null}>All</Option>
            {uniqueCategories.map(category => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
          <Search
            placeholder="Search by name or description"
            onSearch={handleSearch}
            style={{width: 200}}
          />
        </div>
        <Button type="primary" className="add-product-button">
          <Link to="/add">Add Product</Link>
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        search={searchTerm}
      />

      <Modal
        title="Edit Product"
        visible={editModalVisible}
        onCancel={handleEditModalCancel}
        footer={null}
      >
        {selectedProduct && (
          <Form
            layout="vertical"
            onFinish={handleEditFormSubmit}
            initialValues={selectedProduct}
          >
            <Form.Item
              label="Category"
              name="category"
              rules={[{required: true, message: 'Please enter the category!'}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Name"
              name="title"
              rules={[{required: true, message: 'Please enter the name!'}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {required: true, message: 'Please enter the description!'},
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{required: true, message: 'Please enter the price!'}]}
            >
              <Input type="number" min={0} step={0.01} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Product
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default ProductListPage
