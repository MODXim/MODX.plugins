<?php defined('IN_MANAGER_MODE') or die('<h1>ERROR:</h1><p>Please use the MODx Content Manager instead of accessing this file directly.</p>');

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
//  Class for the
//  TreeSelectTV
//  for MODx Evolution CMF
//
//  @version    0.2.1
//  @license    http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
//  @author     sam (sam@gmx-topmail.de)
//  @www        https://github.com/Sammyboy/TreeSelectTV-plugin
//
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


class TreeSelect {

    /**
     * Initializes TreeSelect class
     *
     * @param   $config: configuration array
     */
    function TreeSelect($config) {
        $this->config = $config;
        $this->treeList = array();
        $this->treeList = $this->getDirList();
    }

    /**
     * Formats filesizes to a shorter format
     *
     * @return  string
     */
    protected function format_bytes($bytes, $round_nr) {
        if ($bytes < 1024) return $bytes.' B';
        elseif ($bytes < 1048576) return number_format(round($bytes / 1024, $round_nr), $round_nr).' KB';
        elseif ($bytes < 1073741824) return number_format(round($bytes / 1048576, $round_nr), $round_nr).' MB';
        elseif ($bytes < 1099511627776) return number_format(round($bytes / 1073741824, $round_nr), $round_nr).' GB';
        else return number_format(round($bytes / 1099511627776, $round_nr), $round_nr).' TB';
    }
    
    /**
     * Checks if value is true
     *
     * @return  boolean
     */
    protected function is_true($val) {
        if (!isset($val)) return false;
        if (is_string($val)) $val = strtolower($val);
        elseif (is_bool($val)) return $val;
        elseif (is_int($val)) return $val > 0 ? true : false;
        return in_array($val, array("true", "yes")) ? true : false;
    }
    
    /**
     * Generates an array of folders and files
     *
     * @return  array
     */
    function getDirList(&$list = null, $folder = "", $depth = null) {
        if (!strlen($this->config['list_folders__start']) && !strlen($folder)) return;
        if (!isset($list)) $list = $this->treeList;
        $folder         = (strlen($folder) ? trim($folder, "/") : trim($this->config['list_folders__start'], "/"))."/";
        $depth          = ($depth === null) ? (int) $this->config['list_depth'] : $depth;
        $folders_only   = $this->is_true($this->config['list_folders__only']);
        $files_only     = $this->is_true($this->config['list_files__only']);
        if ($handle = opendir($this->config['list_folders__base'].$folder)) {
            while ($file = readdir($handle)) {
                $path = $this->config['list_folders__base'].$folder.$file;
                $is_dir = is_dir($path);
                $has_size = true;
                $has_content = true;
                
                // Set filters for files and folders
                $filter = $is_dir ? ((isset($this->config['list_folders__filter']) && $this->config['list_folders__filter']) ?
                                        $this->config['list_folders__filter'] : "") : 
                                    ((isset($this->config['list_files__filter'])   && $this->config['list_files__filter']) ?
                                        $this->config['list_files__filter'] : "");
                $accept = $is_dir ? ((isset($this->config['list_folders__accept']) && $this->config['list_folders__accept']) ?
                                        $this->config['list_folders__accept'] : "") : 
                                    ((isset($this->config['list_files__accept'])   && $this->config['list_files__accept']) ?
                                        $this->config['list_files__accept'] : "");

                // … and use them
                if ( !in_array($file, array(".","..")) ) {
                    $size = filesize($path);
                    $key = count($list);

                    $list[$key]['name'] = $file;
                    $list[$key]['size'] = $size;
                    $delete_content = $files_only;

                    if ($is_dir) {
                        $list[$key]['type'] = 'folder';
                        $list[$key]['size'] = 0;

                        // Get subfolders
                        $list[$key]['folder_content'] = $this->getDirList($list[$key]['folder_content'], $folder.$file, $depth ? $depth-1 : $depth);

                        $has_content = $this->hasContent($list[$key]['folder_content']);

                        if ( is_array($list[$key]['folder_content']) &&
                             count($list[$key]['folder_content'])
                           ) {
                            
                            $delete_content = false;
                            foreach ($list[$key]['folder_content'] as $sub) {
                                $list[$key]['size'] = $list[$key]['size'] + $sub['size'];
                            }
                        } else $delete_content = true;
                        
                        if ($depth === 0) $delete_content = true;
                        
                    } else {
                        $list[$key]['type'] = 'file';
                        $delete_content = false;
                        // Check if file is an image
                        $is_image = getimagesize($path);
                        if ($is_image !== false) {
                            // … and add it to the array
                            $list[$key]['img']['src'] = '../'.$folder.$file;
                            list($list[$key]['img']['width'], $list[$key]['img']['height']) = $is_image;
                        }
                        // Check filesize
                        if ( ($this->is_true($this->config['list_files__skip_0b']) && ($size == 0)) ||
                             (($this->config['list_files__minsize'] > -1) && ($size < $this->config['list_files__minsize'])) ||
                             (($this->config['list_files__maxsize'] > -1) && ($size > $this->config['list_files__maxsize']))
                           )
                            $has_size = false;
                    }
                    $list[$key]['formated_size'] = $this->format_bytes($list[$key]['size'], $this->config['list_size_decimals']);

                    if ($delete_content) unset($list[$key]['folder_content']);

                    // use filters
                    if ( ($folders_only && !$is_dir) ||
                         (strlen($filter) && preg_match("/".$filter."/", $file)) ||
                         (strlen($accept) && !preg_match("/".$accept."/", $file)) ||
                         ($depth === 0) ||
                         !$has_size ||
                         ($is_dir && $files_only && $folders_only && !$has_content)
                       )
                        unset($list[$key]['name']);
                }
            }
            closedir($handle);
            // sort the list
            $list = $this->sortList($list);
        } else print_r("Folder {$folder} not found");
        return $list;
    }

    /**
     * Sorts the list by the options, set in the configuration
     *
     * @return  array
     */
    function sortList(&$list = null) {
        if (!isset($list)) $list = $this->treeList;
        if (!isset($list) || !count($list)) return;// "List is empty!";
        if (!$this->config['list_sortBy'] || !in_array($this->config['list_sortBy'], array("name","size")) || (count($list) < 2)) return $list;

        // outer loop
        for ($key_a = count($list)-1; $key_a >= 0; $key_a--) {
            $sorted = true;
            // inner loop
            for ($key_b = 0; $key_b < $key_a; $key_b++) {
                // set key values depending on the sorting direction
                if ($this->config['list_sortDir'] == "desc") {
                    $k[0] = $key_b;
                    $k[1] = $key_b + 1;
                } else {
                    $k[0] = $key_b + 1;
                    $k[1] = $key_b;
                }

                if (($list[$k[0]]['type'] != $list[$k[1]]['type']) && $this->config['list_sortFirst'] && ($this->config['list_sortFirst'] != "not set")) {
                    if ((($this->config['list_sortFirst'] == "folders") && ($this->config['list_sortDir'] == "asc")) ||
                         (($this->config['list_sortFirst'] == "files") && ($this->config['list_sortDir'] == "desc")))
                        // folders first 
                        $res = ($list[$k[0]]['type'] == 'folder') && ($list[$k[1]]['type'] == 'file') ? -1 : 1;
                    else
                        // files first
                        $res = ($list[$k[0]]['type'] == 'folder') && ($list[$k[1]]['type'] == 'file') ? 1 : -1;
                } else {
                    // set the values to sort by
                    $val[0] = $list[$k[0]][$this->config['list_sortBy']];
                    $val[1] = $list[$k[1]][$this->config['list_sortBy']];
                    // compare the values
                    $res = is_numeric($val[0]) && is_numeric($val[1]) ? $val[0] - $val[1] : strcmp($val[0], $val[1]);
                }

                // swap the list items
                if ($res < 0) {
                    $tmp = $list[$k[0]];
                    $list[$k[0]] = $list[$k[1]];
                    $list[$k[1]] = $tmp;
                    $sorted = false;
                }

            } // end inner loop
            if ($sorted) return $list;
        } // end outer loop
    }

    /**
     * Checks if directory has files or subdirectories
     *
     * @return  boolean
     */
    function hasContent($list, $type = "all") {
        if (!isset($list) || !is_array($list) || !count($list)) return false;
        $folders_only = $this->is_true($this->config['list_folders__only']);
        foreach ($list as $li) {
            if ( isset($li['size']) && 
                 ( ($type == 'all') ||
                   (($type == 'folders') && ($li['type'] == 'folder') && !($folders_only && ($li['size'] === 0))) ||
                   (($type == 'files') && ($li['type'] == 'file'))
                 )
               ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Generates HTML list output
     *
     * @return  string
     */
    function list2HTML(&$list = null, $path = "", $level = 1, $counter = 0) {
        if (!isset($list)) $list = $this->treeList;
        // set configuration parameters
        $separator      = isset($this->config['list_separator'])         ? $this->config['list_separator'] : "/";
        $outerTpl       = isset($this->config['list_outerTpl'])         ? $this->config['list_outerTpl'] :
                            '<ul class="item_group level_[+tsp.level+]">[+tsp.wrapper+]</ul>';
        $innerTpl       = isset($this->config['list_innerTpl'])         ? $this->config['list_innerTpl'] :
                            '<li class="item_line [+tsp.lastItem+]" path="[+tsp.path+]">'.
                            '<span class="item_text">[+tsp.name+]</span>[+tsp.wrapper+]</li>';
        $folders_only       = $this->is_true($this->config['list_folders__only']);
        $show_file_size     = $this->is_true($this->config['list_files__show_size']);
        $show_folder_size   = $this->is_true($this->config['list_folders__show_size']);
        $output = "";
        $last = true;

        foreach ($list as $li) {
            if (!isset($li['name'])) continue;
            $new_path = $path.$li['name'].($li['type'] == "folder" ? $separator : "");
            
            $filetype = "";
            if ($li['type'] == 'file') {
                preg_match("/\.(.+)$/", $li['name'], $ext);
                if (count($ext) && strlen($ext[0])) $filetype = "filetype-".strtolower(trim($ext[0], "\."));
            }
            // set placeholders for row output
            $ph =  array();
            $ph['[+tsp.name+]']     = $li['name'];
            $ph['[+tsp.img_src+]']  = isset($li['img']['src']) ? $li['img']['src'] : "";
            $ph['[+tsp.img_w+]']    = isset($li['img']['width']) ? $li['img']['width'] : "";
            $ph['[+tsp.img_h+]']    = isset($li['img']['height']) ? $li['img']['height'] : "";
            $ph['[+tsp.size+]']     = (($li['type'] == 'file') && $show_file_size) ||
                                      (($li['type'] == 'folder') && $show_folder_size) ? $li['formated_size'] : null;
            $ph['[+tsp.path+]']     = $new_path;
            $ph['[+tsp.level+]']    = $level;
            $ph['[+tsp.type+]']     = $li['type'];
            $ph['[+tsp.filetype+]'] = $filetype;
            $ph['[+tsp.lastItem+]'] = ( ($li['type'] == 'folder') &&
                                        ( !$this->hasContent($li['folder_content'], $folders_only ? 'folders' : 'all') ||
                                          (($this->config['list_depth'] !== false) && ($this->config['list_depth'] > -1) && ($level >= $this->config['list_depth'])) )
                                      ) ? "last_item" : "";
            $ph['[+tsp.wrapper+]']  = $this->hasContent($li['folder_content']) ? $this->list2HTML($li['folder_content'], $new_path, $level + 1, $counter) : "";
            // … and parse them
            $output .= str_replace(array_keys($ph), array_values($ph), $innerTpl);
        }
        if (strlen($output)) {
            // set placeholders für list output
            $ph =  array();
            $ph['[+tsp.level+]']    = $level;
            $ph['[+tsp.wrapper+]']  = $output;
            // … and parse them
            $output = str_replace(array_keys($ph), array_values($ph), $outerTpl);
        }

        return $output;
    }

}
?>
