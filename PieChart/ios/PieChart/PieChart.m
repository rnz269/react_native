//
//  PieChart.m
//  PieChart
//
//  Created by Devin Abbott on 6/3/18.
//  Copyright © 2018 Fullstack. All rights reserved.
//

#import "React/RCTViewManager.h"

// This macro exposes our PieChartManager class to React Native. We can now consume a native module called PieChart from our JS by referencing PieChart (Manager suffix not necessary, as JS auto-resolves).
@interface RCT_EXTERN_MODULE(PieChartManager, RCTViewManager)

// Exposes the member variables on our PieChartView class as props to React Native. Types also provided to be marshalled correctly.
RCT_EXPORT_VIEW_PROPERTY(data, NSArray)
RCT_EXPORT_VIEW_PROPERTY(strokeColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(strokeWidth, CGFloat)

@end
