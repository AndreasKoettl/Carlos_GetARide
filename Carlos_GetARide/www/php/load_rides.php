<?php
require_once '../lib/limonade-master/lib/limonade.php';


// just an example
dispatch_post('/upcoming', 'hello');
        function hello()
        {
            echo('hello');
            return 'Hello world!';
        }
run();

?>