<?php

$page->layout = 'admin';

if (! User::require_admin ()) {
	header ('Location: /admin');
	exit;
}

$f = new Form ('post', 'user/add');
if ($f->submit ()) {
	$_POST['password'] = User::encrypt_pass ($_POST['password']);
	$now = gmdate ('Y-m-d H:i:s');
	$_POST['expires'] = $now;
	$_POST['signed_up'] = $now;
	$_POST['updated'] = $now;
	$_POST['userdata'] = json_encode (array ());
	unset ($_POST['verify']);
	$u = new User ($_POST);
	$u->put ();
	Versions::add ($u);
	if (! $u->error) {
		$page->title = i18n_get ('User Added');
		echo '<p><a href="/user/admin">' . i18n_get ('Continue') . '</a></p>';
		$this->hook ('user/add', $_POST);
		return;
	}
	$page->title = 'An Error Occurred';
	echo 'Error Message: ' . $u->error;
} else {
	$u = new User;
	$u->type = 'admin';
	$u->types = array ('admin', 'member');

	$u->failed = $f->failed;
	$u = $f->merge_values ($u);
	$page->title = i18n_get ('Add User');
	echo $tpl->render ('user/add', $u);
}

?>