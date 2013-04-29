//<?php

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
//  @name       TreeSelectTV
//  @category   plugin
//  @version    0.2.1
//  @for        MODX Evolution
//
//
//  @license    http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
//  @author     sam (sam@gmx-topmail.de)
//  @www        https://github.com/Sammyboy/TreeSelectTV-plugin
//
/*  @internal   @plugin configuration:

&pluginPath=Plugin path;string;assets/plugins/TreeSelect/
&input_tvids=TV IDs;string;
&input_tplids=Template IDs;string;
&input_roles=Roles;string;
&input_status=Inputfield status;list;hide,show,toggle;hide
&list_separator=Separator;string;/
&list_depth=Tree depth;int;-1
&list_sortBy=Sort by;list;unsorted,name,size;name
&list_sortDir=Sort direction;list;asc,desc;asc
&list_sortFirst=Sort first;list;not set,folders,files;folders
&list_hideOnSelect=Hide on select;list;yes,no;no
&list_image_view=Image preview;list;yes,no;yes
&list_path_base=Path base;list;Start folder,Website base,Server root;Start folder
&list_folders__base=Base folder (leave empty for MODX base path);string;
&list_folders__start=Start folder;string;assets/files
&list_folders__filter=Folders to ignore (reg. expr.);string;^\.+
&list_folders__accept=Folders to accept (reg. expr.);string;.*
&list_folders__show_size=Show folder sizes;list;yes,no;yes
&list_folders__only=Folders only;list;yes,no;no
&list_files__filter=Files to ignore;string;^\.+
&list_files__accept=Files to accept;string;.*
&list_files__show_size=Show file sizes;list;yes,no;yes
&list_files__skip_0b=Skip empty files;list;yes,no;no
&list_files__maxsize=Max. filesize;int;-1
&list_files__minsize=Min. filesize;int;-1
&list_files__only=Files only;list;yes,no;no
&list_size_decimals=Number of decimals to display;int;2

*/
//  @internal   @events OnDocFormRender
//
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

$_ts_error = "<strong>TreeSelect plugin error</strong>: ";

if (!strlen($pluginPath)) { print_r($_ts_error."Plugin path is not set!"); return; }
$pluginPath = MODX_BASE_PATH.trim($pluginPath, '/').'/';

include $pluginPath."TreeSelect.core.php";
