const express = require('express');
const app = express();
const port = 3333;
var fs = require('fs');
// khai báo Multer
const multer = require('multer');


// Khai báo cors
var cors = require('cors');
app.use(cors());
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('./public/images'))

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'appserver'
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/', function(req, res){
    con.query("SELECT * FROM hoadon", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
})


// Làm thêm hình
// SET STORAGE
let  imgname;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    const myArray = file.originalname.split('.');
   imgname = new Date().getTime().toString() + "."  +myArray[myArray.length - 1];
    cb(null,imgname);
  }
})
 
let upload = multer({ storage: storage })
app.post('/uploadfile', upload.single('file'), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
})


app.get('/images', function (req, res) {
  res.send('hình ảnh!');
});




// Tất cả sản phẩm
app.post('/1', function (req, res) {
    console.log(req.body);
    var id =""
    var sql = "insert into taikhoan values('" + id + "','" + req.body.tenTk + "' ,'" + req.body.mk + "')";
    console.log(sql);
    
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      if (result.affectedRows == 1) {
        res.send('ok')
      }
    });
})


app.post('/2', function (req, res) {
   
  var sql = "UPDATE taikhoan SET tenTk = '"+req.body.tenTkSua+"',mk = '"+req.body.mkSua+"' where id ='"+req.body.idTkSua+"'";
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.affectedRows == 1) {
      res.send('ok')
    }
  });
  
})


app.get('/taikhoan', function(req, res){
    con.query("SELECT * FROM taikhoan", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
})


app.get('/danhmuc', function(req, res){
  con.query("SELECT * FROM danhmucsanpham", function (err, result, fields) {
      if (err) throw err;
      // console.log(result);
      res.send(result);
  });
})

//hiển thị danh mục sản phẩm
app.get('/danhmucsanpham', function (req, res) {
    con.query("SELECT * FROM taikhoan", function (err, result, fields) {
      // console.log(result);
      if (err) throw err;
      res.send(result);
      });
  });

  // hiển thịdanh sách nhân viên 
app.get('/danhsachnv', function (req, res) {
  con.query("SELECT * FROM nhanvien  ORDER BY idNhanVien DESC", function (err, result, fields) {
    //  console.log(result);
    if (err) throw err;
    res.send(result);
    });
});
  //hiển thịdanh sách nhân viên 
  app.get('/danhsachkh', function (req, res) {
    con.query("SELECT * FROM khachhang  ORDER BY idKhachHang DESC", function (err, result, fields) {
      //  console.log(result);
      if (err) throw err;
      res.send(result);
      });
  });

  //Xóa danh mục Sản Phẩm
app.post('/deletedanhmucsanpham', function(req, res){
    // console.log("abc")
    var sql = "delete from taikhoan where id = ("+req.body.myid+")";
    console.log(sql);
    con.query(sql, function(err, result, fields){
      if(err) throw err;
      if(result =='okdelete'){
        result.send('okdelete');
      }
    });
  })
// Thêm Nhân viên 
app.post('/themnhanvien', upload.single('file'), function (req, res) {
  var id =""
  var sql = "insert into nhanvien values('" + id + "','" + req.body.tenNV + "' ,'" + req.body.gioiTinh + "','" + req.body.diaChi + "','" + req.body.sdt + "','" + req.body.ngaySinh + "','" + req.body.ngayVaoLam + "','" + req.body.cmnd + "','" + imgname  + "')";
  console.log(sql);
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.affectedRows == 1) {
      res.send('ok')
    }
  })

})

// Thêm Nhân viên 
app.post('/themkhachhang', function (req, res) {
  console.log(req.body);
  var id =""
  var sql = "insert into khachhang values('" + id + "','" + req.body.tenKH + "' ,'" + req.body.diaChi + "','" + req.body.sdt + "')";
  console.log(sql);
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.affectedRows == 1) {
      res.send('ok')
    }   
  });
})
// Thêm Danh Mục
app.post('/themdanhmuc', function (req, res) {
  console.log(req.body);
  var id =""
  var sql = "insert into danhmucsanpham values('" + id + "','" + req.body.tenDanhMuc + "' ,'" + " " + "')";
  console.log(sql);
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.affectedRows == 1) {
      res.send('ok')
    }   
  });
})


  //Xóa Nhân Viên
  app.post('/xoanhanvien', function(req, res){

    var sql = "delete from nhanvien where idNhanVien = ("+req.body.myid+")";
    console.log(sql);
    con.query(sql, function(err, result, fields){
      if(err) throw err;
      if(result =='okdelete'){
        result.send('okdelete');
      }
    });
  })

    //Xóa Khách Hàng
    app.post('/xoakhachhang', function(req, res){

      var sql = "delete from khachhang where idKhachHang = ("+req.body.myid+")";
      console.log(sql);
      con.query(sql, function(err, result, fields){
        if(err) throw err;
        if(result =='okdelete'){
          result.send('okdelete');
        }
      });
    })
  

// Sửa nhân viên
app.post('/suanhanvien', function (req, res) {
   
  var sql = "UPDATE nhanvien SET tenNV = '"+req.body.tenNV+"',gioiTinh = '"+req.body.gioiTinh+"',diaChi = '"+req.body.diaChi+"' ,SDT = '"+req.body.sdt+"',ngaySinh = '"+req.body.ngaySinh+"',ngayVaoLam = '"+req.body.ngayVaoLam+"',CMND = '"+req.body.cmnd+"' ,hinhAnh = '"+imgname+"'  where idNhanVien ='"+req.body.idNV+"'";
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.affectedRows == 1) {
      res.send('ok')
    }
  });
  
})

// Sửa khach hang
app.post('/suakhachhang', function (req, res) {
   
  var sql = "UPDATE khachhang SET tenKH = '"+req.body.tenNV+"',diaChi = '"+req.body.diaChi+"',sdt  = '"+req.body.sdt+"'  where idKhachHang ='"+req.body.idNV+"'";
  console.log(sql);
  
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    if (result.affectedRows == 1) {
      res.send('ok')
    }
  });
  
})

//Sửa chi tiết sản phẩm lấy theo ID 
app.get('/edit/:id', function (req, res) {
  var page = req.params.id;
  
  var sql = "SELECT * FROM nhanvien WHERE idNhanVien = " + page;
  con.query(sql , function (err, result, fields) {
    if (err) throw err;
    /// console.log(result);

    res.send(result);
    });
});


//Sửa chi tiết sản phẩm lấy theo ID 
app.get('/editkh/:id', function (req, res) {
  var page = req.params.id;
  
  var sql = "SELECT * FROM khachhang WHERE idKhachHang = " + page;
  con.query(sql , function (err, result, fields) {
    res.send(result);
    });
});

// ERR 404
app.use(function(req, res, next) {
  res.status(404);
  res.send('404: Không có trang nàyy');
});

app.listen(port, function(error){
    if (error) {
        console.log("Something went wrong");
    }
    console.log("server is running port:  " + port);
})

