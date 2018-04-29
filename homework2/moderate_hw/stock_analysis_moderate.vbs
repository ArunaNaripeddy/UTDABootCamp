' Stock Analysis Script - Moderate Version

'1. This script will loop through each year of stock data and grab the total amount of volume each stock had over the year.
'2. Calculates the Yearly change and Percent of yearly change for the stock price
'3. Also displays the ticker symbol to coincide with the total volume.

Sub yearly_percent_change()

    ' Variable for worksheet
    Dim ws As Worksheet
    ' Variable for last row of the worksheet
    Dim last_row As Long
    ' Variable to store the row number of the Stock Total Volume table
    Dim total_stock_table_row As Long
    ' Variable to compute total stock volume for each stock per year
    Dim total_stock_vol As Double
    Dim open_price_index As Long
    Dim open_price, close_price As Long
    Dim yearly_change, percent_change As Double
    
    'Looping through all the worksheets in the worbook
    For Each ws In Worksheets
    
        'header for the stock volume table at I1
        ws.Range("I1").Value = "Ticker"
        
        'header for yearly change, calculated by taking the difference between the close price and the open price
        ws.Range("J1").Value = "Yearly Change"
        
        'yearly change expressed in percent change
        ws.Range("K1").Value = "Percent Change"
        
        ws.Range("L1").Value = "Total Stock Volume"   'header for the stock volume table at J1
        last_row = ws.Cells(Rows.Count, 1).End(xlUp).Row   'Calculating the last row number for the active worksheet
        
        'Initializing the helper variables
        total_stock_table_row = 2
        total_stock_vol = 0
        open_price_index = 2
                
        'Iterating through all the rows in the worksheet
        For i = 2 To last_row
            
            'Check if the ticker is same for the two subsequent rows
            If (ws.Cells(i + 1, 1).Value <> ws.Cells(i, 1).Value) Then
                
                open_price = ws.Cells(open_price_index, 3).Value
                close_price = ws.Cells(i, 6).Value
                yearly_change = close_price - open_price
                
                'Handling exception when the open price is zero
                If (open_price = 0) Then
                    percent_change = yearly_change
                Else
                    percent_change = yearly_change / open_price
                End If
                
                ws.Range("I" & total_stock_table_row).Value = ws.Cells(i, 1).Value
                ws.Range("J" & total_stock_table_row).Value = yearly_change
                          
                'Formatting the cell to Red if the yearly change is negative and green if positive
                If (yearly_change < 0) Then
                    ws.Range("J" & total_stock_table_row).Interior.ColorIndex = 3
                Else
                    ws.Range("J" & total_stock_table_row).Interior.ColorIndex = 4
                End If
                
                'Formatting yearly change to percentage
                ws.Range("K" & total_stock_table_row).Value = Format(Str(percent_change), "percent")
                
                ' If ticker symbols are different, update the stock volume table with the calculated total stock volume
                ws.Range("L" & total_stock_table_row).Value = total_stock_vol + ws.Cells(i, 7).Value
                
                total_stock_table_row = total_stock_table_row + 1
                total_stock_vol = 0
                open_price_index = i + 1
            Else
                'If ticker symbol is same for the subsequent rows, sum up the total stock volume
                total_stock_vol = total_stock_vol + ws.Cells(i, 7)
                
                
            End If
        Next i
    Next ws
End Sub

