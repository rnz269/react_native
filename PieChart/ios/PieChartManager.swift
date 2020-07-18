//
//  PieChartManager.swift
//  PieChart
//
//  Created by Devin Abbott on 6/3/18.
//  Copyright © 2018 Fullstack. All rights reserved.
//

// Foundation class includes NSObjects like NSString, NSArray
import Foundation

@objc(PieChartManager)
class PieChartManager: RCTViewManager {
  override func view() -> UIView! {
    return PieChartView(frame: .zero)
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
