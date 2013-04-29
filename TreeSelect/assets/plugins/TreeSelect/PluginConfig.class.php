<?php defined('IN_MANAGER_MODE') or die('<h1>ERROR:</h1><p>Please use the MODx Content Manager instead of accessing this file directly.</p>');

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
//  PluginConfig class
//  for MODx Evolution CMF
//
//  Reads the configuration string of a MODx plugin from the database and makes
//  it usable as an array
//
//  @version    1.0
//  @license    http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
//  @author     sam (sam@gmx-topmail.de)
//  @www        https://github.com/Sammyboy/TreeSelectTV-plugin
//
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


class PluginConfig {

    /**
     * Initialize the PluginConfig class
     *
     * @param   $pluginText: Identification string inside of the plugin code
     */
    function PluginConfig($pluginText) {
        $this->pluginInfo = $this->getInfo($pluginText);
        $this->config = $this->getConfig();
    }


    /**
     * Returns plugin informations: id, name, version, author, license, properties
     *
     * @return  array or boolean
     */
    function getInfo($pluginText) {
        global $modx;
        $table = $modx->getFullTableName('site_plugins');

        $fields =   "id,name,".
                    "SUBSTR(plugincode, INSTR(plugincode, '@version'), 200) as version,".
                    "SUBSTR(plugincode, INSTR(plugincode, '@author'), 200) as author,".
                    "SUBSTR(plugincode, INSTR(plugincode, '@license'), 200) as license,".
                    "properties";
        $where =    "plugincode LIKE '%{$pluginText}%'";
        $query = $modx->db->select($fields, $table, $where);
        $output = $modx->db->makeArray($query);
        if (!count($output)) return false;
        foreach ($output[0] as $key => $val) {
            if ($val[0] == "@")
                $output[0][$key] = trim(str_replace("@".$key, '', substr($val, 0, strpos($val, "\n"))));
        }
        return $output[0];
    }


    /**
     * Deletes an option by name
     *
     * @return  boolean
     */
    function deleteOption($name = "") {
        if (!strlen($name) || !isset($this->config['type'][$name])) return false;
        foreach (array_keys($this->config) as $i) {
            if (isset($this->config[$i][$name])) unset($this->config[$i][$name]);
        }
        return true;
    }
    
    
    /**
     * Overwrites an option by name
     *
     * @return  boolean
     */
    function setOption($name, $text, $type = "string", $value = null, $options = null) {
        if (!strlen($name)) return false;
        $this->config['text'][$name] = $text;
        $this->config['type'][$name] = $type;
        $this->config['values'][$name] = $value;
        $this->config['options'][$name] = $options;
        return true;
    }


    /**
     * Reads a plugin configuration string and returns it as an array
     *
     * @return  array
     */
    function getConfig($config_string = "") {
        $opt = array();
        if (!strlen($config_string)) $config_string = $this->pluginInfo['properties'];
        $configs = explode("&", $config_string);
        if (!count($configs)) return false;
        foreach ($configs as $config) {
            if (!strlen($config)) continue;
            list($key, $values) = explode("=", trim($config));
            $values = explode(";", $values);
            $opt['text'][$key] = $values[0];
            $opt['type'][$key] = $values[1];
            if ($opt['type'][$key] == 'list') {
                $opt['options'][$key] = explode(",", $values[2]);
                $opt['values'][$key] = $values[3];
            } else $opt['values'][$key] = $values[2];
        }
        return $opt;
    }


    /**
     * Converts a config-array into a string
     *
     * @return  string
     */    
    function setConfigString($config = "") {
        if (!is_array($config)) $config = isset($this->config) ? $this->config : null;
        if (!isset($config) || !is_array($config)) return false;
        $output = "";
        foreach ($config['text'] as $i => $text) {
            $output .=  (strlen($output) ? " " : "").
                        "&{$i}={$text};{$config['type'][$i]};".
                        (($config['type'][$i] == "list" && isset($config['options'][$i])) ?
                            (is_array($config['options'][$i]) ?
                                implode(",", $config['options'][$i]) 
                                : $config['options'][$i]).";"
                            : "").
                        $config['values'][$i];
        }
        return $output;
    }


    /**
     * Saves new properties to database
     *
     * @return  boolean
     */    
    function saveProperties($string = "", $id = 0) {
        global $modx;
        if ($id === 0) $id = $this->pluginInfo['id'];
        if (!isset($id) || !strlen($string)) return false;
        $table = $modx->getFullTableName('site_plugins');
        $string = $modx->db->escape($string);
        $result = $modx->db->update('properties="'.$string.'"', $table, 'id="'.$id.'"');
        return $result;
    }
}
?>
