<?php defined('IN_MANAGER_MODE') or die('<h1>ERROR:</h1><p>Please use the MODx Content Manager instead of accessing this file directly.</p>');

//==============================================================================
//  IMPORTANT NOTICE:
//
//  Except of the settings for outerTpl and innerTpl all values in this file
//  will be overwritten by the plugin configuration in the manager backend, so
//  it is not necessary to change the values in this file.
//
//  To set up an individual template variable, make a copy of this file, rename
//  it to *.config.inc.php (where * should be replaced by a name of your choice,
//  e.g. "tv23.config.inc.php") and set the correct values in there.
//  Inside the new file you may delete the lines (and comments) you don't need,
//  except of the first and the last line.
//
//==============================================================================

//  Default settings

//---------------
//  Input field
//---------------

$settings['input_tvids']     = "";
//  String with the id (or a comma separated list of ids) of template variables
//  to be used with. For each list a CSS ID with the name treeBox_tv* will be
//  generated where * will be replaced with the ID of the TV, e.g. treeBox_tv5
//  or treeBox_tv12, so each list can be styled individually

$settings['input_tplids']    = "";
//  ID of template used ("" = all templates)

$settings['input_roles']     = "";
//  1 = Administrator, 2 = Editor, 3 = Publisher ("" = all roles)

$settings['input_status']    = "";
//  Status how to display input field. Options: "show", "toggle" or ""

//---------------
//  List
//---------------
$settings['list_separator']          = "/";
//  List item separator string for the result string, displayed in the input field

$settings['list_depth']              = -1;
//  Integer value for the level depth of subfolders; Set false for all levels

$settings['list_sortBy']             = "name";
//  Fields to sort by
//  Options:    "name", "size"

$settings['list_sortDir']            = "asc";
//  Sorting direction
//  Options:    "asc", "desc"

$settings['list_sortFirst']          = "folders";
//  Sorting direction
//  Options:    "folders", "files", "nothing"

$settings['list_size_decimals']      = 2;
//  Number of decimals to display filesizes

$settings['list_hideOnSelect']       = "no";
//  String value ("yes"|"no"); Hides list on clicking item
//  (only if input status is set to "toggle")

$settings['list_image_view']         = "no";
//  String value ("yes"|"no"); Preview for image files

$settings['list_path_base']          = "Start folder";
//  Base to display path from
//  Options: "Start folder", "Website base", "Server root" (not case sensitive)

//---------------
//  Folders
//---------------
$settings['list_folders__base']    = "";
//  Absolute base path on the server; If empty or not set, the constant
//  MODX_BASE_PATH will be set.

$settings['list_folders__start']   = "";
//  Folder location where to start showing folders and files from in the list

$settings['list_folders__filter']  = "^\.+";
//  Regular expression of filter string for folders NOT to be listed

$settings['list_folders__accept']  = ".*";
// Regular expression of filter string for folders to ACCEPT ONLY

$settings['list_folders__only']    = "no";
// String value ("yes"|"no"); Set "yes" to display folders only

$settings['list_folders__show_size'] = "yes";
// String value ("yes"|"no"); Set "yes" to display folders sizes

//---------------
// Files
//---------------
// Regular expression of filter strings…

$settings['list_files__filter']    = "^\.+";
// …for files NOT to be listed

$settings['list_files__accept']    = ".*";
// …for files to be listed ONLY e.g. "\.(jpg|png|gif)$";

$settings['list_files__show_size'] = "yes";
// Boolean value (true|false); Set true to display file sizes

$settings['list_files__skip_0b']   = "no";
// Set "yes" to skip files if its size is 0 byte

$settings['list_files__maxsize']   = -1;
// Maximum size of files to be listed 

$settings['list_files__minsize']   = -1;
// Minimum size of files to be listed

$settings['list_files__only']      = "no";
// If this is set "yes", only folders that contain files are shown in the tree
// and (if "folders only" option is not set) only files are set as result

// HTML semplates with placeholders for the lists
// Outer template:
$settings['list_outerTpl']   =
    '<ul class="item_group level_[+tsp.level+]">'.
        '[+tsp.wrapper+]'.
    '</ul>';

// Inner Template:
$settings['list_innerTpl']   =
    '<li class="item_line [+tsp.type+] [+tsp.filetype+] [+tsp.lastItem+]" '.
        'path="[+tsp.path+]" img="[+tsp.img_src+]">'.
        '<span class="folder_status toggler"></span>'.
        '<span class="item_icon toggler"></span>'.
        '<span class="item_text selector">'.
            '<span class="filename">[+tsp.name+]</span>'.
            '<span class="filesize">[+tsp.size+]</span>'.
        '</span>'.
        '[+tsp.wrapper+]'.
    '</li>';

?>
