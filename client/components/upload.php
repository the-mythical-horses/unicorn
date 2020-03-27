<?php
if (isset($_POST['submit'])) {
  $file = $_FILES['file'];

  $fileName = $_FILES['file']['name'];
  $fileTmpName = $_FILES['file']['tmp_name'];
  $fileSize = $_FILES['file']['size'];
  $fileError = $_FILES['file']['error'];
  $fileType = $_FILES['file']['type'];

  $fileExt = explode('.', $filename)
  $fileActualExt = strtolower(end($fileExt));

  $allowed = ['jpg', 'jpeg', 'png']

  if (in_array($fileActualExti, $allowed)) {
      if ($fileError === 0) {
        if ($fileSize < 1000000) {
          $fileNameNew = uniqid('', true).".".$fileActualExti;
          $fileDestination = 'uploads/'.$fileNameNew;
          move_uploaded_file($fileTmpName, $fileDestination);
          header("location: index.php")
        } else {
          echo 'Your file is too long';
        }
      } else {
        echo 'error';
      }
  } else {
    echo 'you cannot upload files of this type';
  }
}
