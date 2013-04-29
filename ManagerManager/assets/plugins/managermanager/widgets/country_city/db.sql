SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `modx_city`
-- ----------------------------
DROP TABLE IF EXISTS `modx_city`;
CREATE TABLE `modx_city` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `country_id` int(10) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of modx_city
-- ----------------------------

-- ----------------------------
-- Table structure for `modx_country`
-- ----------------------------
DROP TABLE IF EXISTS `modx_country`;
CREATE TABLE `modx_country` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of modx_country
-- ----------------------------
