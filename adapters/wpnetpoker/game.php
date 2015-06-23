<?php

	require_once __DIR__."/src/utils/WpUtil.php";
	require_once __DIR__."/src/utils/ActiveRecord.php";
	require_once __DIR__."/src/utils/Template.php";

	require_once WpUtil::getWpLoadPath();

	global $wpdb;

	ActiveRecord::setTablePrefix($wpdb->prefix);
	ActiveRecord::setPdo(WpUtil::getCompatiblePdo());

	$template=new Template(__DIR__."/src/template/game.tpl.php");
	$template->set("bundleLoaderUrl","res/bundleloader.min.js");
	$template->set("bundleUrl","bin/netpokerclient.bundle.min.js");
	$template->set("title","Poker");
	$template->set("spriteSheets",array());
	$template->show();