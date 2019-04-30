<?php
require_once '../lib/limonade-master/lib/limonade.php';

dispatch_post('/hello', 'hello');
function hello() {
	return 'asf';
}
run();
?>