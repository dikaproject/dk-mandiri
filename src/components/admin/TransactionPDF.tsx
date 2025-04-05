import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Transaction } from '@/types/transaction';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 50,
  },
  companyInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyDetail: {
    fontSize: 10,
    color: '#555555',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoTable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoColumn: {
    width: '48%',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    width: '40%',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoValue: {
    width: '60%',
    fontSize: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    borderBottomStyle: 'solid',
  },
  tableRowHeader: {
    backgroundColor: '#F3F4F6',
  },
  tableColHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    padding: 8,
  },
  tableCol: {
    fontSize: 10,
    padding: 8,
  },
  productCol: {
    width: '40%',
  },
  qtyCol: {
    width: '15%',
    textAlign: 'center',
  },
  priceCol: {
    width: '20%',
    textAlign: 'right',
  },
  amountCol: {
    width: '25%',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '15%',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'right',
  },
  footer: {
    marginTop: 30,
    flexDirection: 'column',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerSignature: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  signatureBox: {
    width: '45%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    width: '80%',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

interface TransactionPDFProps {
  transaction: Transaction;
}

const formatToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const TransactionPDF = ({ transaction }: TransactionPDFProps) => {
  // Extract transaction details
  const { id, createdAt, amount, status } = transaction;
  const { orderItems, orderType, user, shippingAddress } = transaction.order;
  const transactionDate = formatDate(createdAt);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo and Company Info */}
        <View style={styles.header}>
          <View>
            {/* If you have a logo, uncomment this */}
            {/* <Image src="/logo.png" style={styles.logo} /> */}
            <Text style={styles.companyName}>DK Mandiri</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyDetail}>Jl. Mandiri No. 123</Text>
            <Text style={styles.companyDetail}>Telp: 021-12345678</Text>
            <Text style={styles.companyDetail}>Email: info@dkmandiri.com</Text>
          </View>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>INVOICE</Text>
        
        {/* Transaction Info */}
        <View style={styles.infoTable}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Invoice No:</Text>
              <Text style={styles.infoValue}>{id.slice(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{transactionDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Type:</Text>
              <Text style={styles.infoValue}>{orderType}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{status}</Text>
            </View>
          </View>
          
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Customer:</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
            {user.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            )}
            {shippingAddress && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={styles.infoValue}>{shippingAddress}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableRowHeader]}>
            <Text style={[styles.tableColHeader, styles.productCol]}>Product</Text>
            <Text style={[styles.tableColHeader, styles.qtyCol]}>Weight (g)</Text>
            <Text style={[styles.tableColHeader, styles.priceCol]}>Price/kg</Text>
            <Text style={[styles.tableColHeader, styles.amountCol]}>Amount</Text>
          </View>
          
          {/* Table Rows */}
          {orderItems.map((item, index) => {
            const itemPrice = item.price / (item.weight / 1000);  // Convert to price per kg
            
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCol, styles.productCol]}>{item.product.name}</Text>
                <Text style={[styles.tableCol, styles.qtyCol]}>{item.weight}</Text>
                <Text style={[styles.tableCol, styles.priceCol]}>{formatToIDR(itemPrice)}</Text>
                <Text style={[styles.tableCol, styles.amountCol]}>{formatToIDR(item.price)}</Text>
              </View>
            );
          })}
        </View>
        
        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatToIDR(amount)}</Text>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business!</Text>
          <Text style={styles.footerText}>This is a computer-generated document. No signature is required.</Text>
          
          {orderType === 'OFFLINE' && (
            <View style={styles.footerSignature}>
              <View style={styles.signatureBox}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Customer</Text>
              </View>
              <View style={styles.signatureBox}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>DK Mandiri Staff</Text>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default TransactionPDF;