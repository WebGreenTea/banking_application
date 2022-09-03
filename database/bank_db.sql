-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2022 at 10:06 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bank_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `transaction_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `action` varchar(20) NOT NULL,
  `recipient` int(11) DEFAULT NULL,
  `sender` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transaction_id`, `users_id`, `date_time`, `transaction_amount`, `action`, `recipient`, `sender`) VALUES
(31, 33, '2022-09-03 00:54:51', '24000.50', 'deposit', NULL, NULL),
(32, 33, '2022-09-03 00:55:04', '100.00', 'withdraw', NULL, NULL),
(33, 31, '2022-09-03 00:55:22', '1000000.00', 'deposit', NULL, NULL),
(34, 31, '2022-09-03 00:55:34', '20000.00', 'withdraw', NULL, NULL),
(35, 31, '2022-09-03 00:55:58', '89000.00', 'transfer', 32, NULL),
(36, 32, '2022-09-03 00:55:58', '89000.00', 'receive', NULL, 31),
(37, 31, '2022-09-03 00:56:13', '5000.00', 'deposit', NULL, NULL),
(38, 31, '2022-09-03 00:56:21', '156.79', 'deposit', NULL, NULL),
(39, 31, '2022-09-03 00:56:34', '7650.00', 'withdraw', NULL, NULL),
(40, 32, '2022-09-03 00:57:04', '78221.00', 'withdraw', NULL, NULL),
(41, 32, '2022-09-03 00:57:11', '100.00', 'deposit', NULL, NULL),
(42, 32, '2022-09-03 00:57:26', '700.00', 'transfer', 33, NULL),
(43, 33, '2022-09-03 00:57:26', '700.00', 'receive', NULL, 32),
(44, 32, '2022-09-03 00:58:08', '30000.00', 'deposit', NULL, NULL),
(45, 32, '2022-09-03 00:58:24', '10000.00', 'transfer', 31, NULL),
(46, 31, '2022-09-03 00:58:24', '10000.00', 'receive', NULL, 32),
(47, 31, '2022-09-03 00:58:59', '90000.00', 'transfer', 32, NULL),
(48, 32, '2022-09-03 00:58:59', '90000.00', 'receive', NULL, 31),
(49, 31, '2022-09-03 00:59:24', '75693.35', 'transfer', 33, NULL),
(50, 33, '2022-09-03 00:59:24', '75693.35', 'receive', NULL, 31),
(51, 31, '2022-09-03 00:59:39', '3400.00', 'deposit', NULL, NULL),
(52, 32, '2022-09-03 01:00:13', '500.00', 'transfer', 31, NULL),
(53, 31, '2022-09-03 01:00:13', '500.00', 'receive', NULL, 32),
(54, 33, '2022-09-03 01:00:34', '4000.00', 'transfer', 31, NULL),
(55, 31, '2022-09-03 01:00:34', '4000.00', 'receive', NULL, 33);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `users_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `account_number` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`users_id`, `first_name`, `last_name`, `password`, `email`, `balance`, `account_number`) VALUES
(31, 'Sahawut', 'Boonyurn', '$2a$10$GWep2ROMXH.eUJ9F55ynaeAaf92NtAzUio2pwU.6kcxGOjsAJxR5a', 'sahawut092013@gmail.com', '740713.44', '7533361263'),
(32, 'sahawuth', 'boonyurn', '$2a$10$4ok4dj1Ra3JuMfEZ9gh9E..Gw2MmEyb6vBhqY4sJzgsNfgRq4C3QS', 'sahawuth.boonyurn@gmail.com', '119679.00', '3005017607'),
(33, 'Web', 'GreenTea', '$2a$10$reVc0yx9EX9SEO4CL47U.uEb7gKhzzU2cE7YjNl9qwX9vY/Jqo6yi', 'sahawut1334@gmail.com', '96293.85', '1135240800');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `users_id` (`users_id`),
  ADD KEY `recipient` (`recipient`),
  ADD KEY `sender` (`sender`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`users_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `users_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`),
  ADD CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`recipient`) REFERENCES `users` (`users_id`),
  ADD CONSTRAINT `transaction_ibfk_3` FOREIGN KEY (`sender`) REFERENCES `users` (`users_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
