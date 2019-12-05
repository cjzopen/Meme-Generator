<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $client_id="1f038a4ff665eae";

   // base64 or image link
  $image = htmlspecialchars(stripslashes($_POST['image']),  ENT_QUOTES);
  preg_match('/.*base64,(.*)/', $image, $group);
  $image= $group[1];
  $title = 'meme';


  $curl_post_array = [
    'image' => $image,
    'title' => $title,
  ];
  $timeout = 30;

  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, 'https://api.imgur.com/3/image.json');
  curl_setopt($curl, CURLOPT_TIMEOUT, $timeout);
  curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Client-ID ' . $client_id));
  curl_setopt($curl, CURLOPT_POST, 1);
  curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_array);
  $curl_result = curl_exec($curl);
  curl_close ($curl);
  $Received_JsonParse = json_decode($curl_result,true);

  if ($Received_JsonParse['success'] = true) {
   $ImgURL = $Received_JsonParse['data']['link'];
   // echo "Uploaded<br/><br/><img src='".$ImgURL."'/>";
  } else {
   // echo "Error<br/><br/>".$Received_JsonParse['data']['error'];
  };
  echo json_encode($Received_JsonParse);
}
?>