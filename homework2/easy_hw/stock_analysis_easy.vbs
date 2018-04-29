' Stock Analysis Script - Easy Version

'1. This script will loop through each year of stock data and grab the total amount of volume each stock had over the year.

'2. Also displays the ticker symbol to coincide with the total volume.

Sub Calculate_TotalStock_Volume()

    ' Variable for worksheet 
    Dim ws As Worksheet
    ' Variable for last row of the worksheet 
    Dim last_row As Long
    ' Variable to store the row number of the Stock Total Volume table  
    Dim total_stock_table_row As Long
    ' Variable to compute total stock volume for each stock per year 
    Dim total_stock_vol As Double
    
    'Looping through all the worksheets in the worbook
    For Each ws In Worksheets
        ws.Range("I1").Value = "Ticker"    'header for the stock volume table at I1
        ws.Range("J1").Value = "Total Stock Volume"   'header for the stock volume table at J1
        last_row = ws.Cells(Rows.Count, 1).End(xlUp).Row   'Calculating the last row number for the active worksheet
        
        'Initializing the helper variables
        total_stock_table_row = 2
        total_stock_vol = 0
        
        'Iterating through all the rows in the worksheet
        For i = 2 To last_row
            'Check if the ticker is same for the two subsequent rows
            If (ws.Cells(i + 1, 1).Value <> ws.Cells(i, 1).Value) Then
                ' If ticker symbols are different, update the stock volume table with the calculated total stock volume
                ws.Range("I" & total_stock_table_row).Value = ws.Cells(i, 1).Value
                ws.Range("J" & total_stock_table_row).Value = total_stock_vol + ws.Cells(i, 7).Value
                total_stock_table_row = total_stock_table_row + 1
                total_stock_vol = 0
            Else
                'If ticker symbol is same for the subsequent rows, sum up the total stock volume
                total_stock_vol = total_stock_vol + ws.Cells(i, 7).Value
            End If
        Next i
    Next ws
End Sub
