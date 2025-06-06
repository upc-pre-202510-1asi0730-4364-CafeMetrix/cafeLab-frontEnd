}
.step-content h2 {
  font-size: 38px;
  color: #49543b;
  margin-bottom: 32px;
  text-align: center;
  font-weight: 700;
}
.input-lote {
  width: 60%;
  max-width: 600px;
  font-size: 28px;
  padding: 18px 24px;
  border-radius: 12px;
  border: 2px solid #444;
  margin: 0 auto;
  display: block;
  background: #fff;
  color: #444;
}
.actions-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}
.cancel-btn, .continue-btn {
  background: #444d39;
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 20px;
  padding: 12px 38px;
  font-weight: 500;
  box-shadow: 2px 4px 8px rgba(0,0,0,0.10);
  cursor: pointer;
  transition: background 0.2s;
}
.cancel-btn {
  background: #5e5e4d;
}
.cancel-btn:hover, .continue-btn:hover {
  background: #2d3a2e;
}
.costs-row {
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-bottom: 30px;
}
.cost-card {
  flex: 1;
  min-width: 340px;
  background: #fff;
  border: 2px solid #444;
  border-radius: 16px;
  padding: 28px 24px 18px 24px;
  margin: 0 10px;
}
.cost-card h3 {
  font-size: 26px;
  color: #49543b;
  margin-bottom: 18px;
  font-weight: 700;
}
.cost-fields {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.cost-fields > div {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 180px;
  margin-bottom: 12px;
}
.cost-fields label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
}
.cost-fields input {
  font-size: 18px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1.5px solid #bbb;
  background: #fff;
  color: #333;
}
.readonly {
  background: #ccc;
  color: #444;
  font-weight: 600;
}
.selected-lot-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}
.selected-lot-label {
  font-weight: 600;
  color: #444;
  font-size: 20px;
}
.selected-lot-value {
  font-size: 20px;
  color: #2d3a2e;
  background: #e0e0e0;
  padding: 6px 18px;
  border-radius: 8px;
}
.change-lot-btn {
  background: #fff;
  color: #444d39;
  border: 1.5px solid #444d39;
  border-radius: 8px;
  font-size: 16px;
  padding: 6px 18px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.change-lot-btn:hover {
  background: #444d39;
  color: #fff;
}
.costs-directos-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 30px;
}
.costs-row-top {
  display: flex;
  flex-direction: row;
  gap: 32px;
  margin-bottom: 18px;
}
.costs-row-bottom {
  display: flex;
  flex-direction: row;
  gap: 32px;
}
.cost-card.exact {
  background: #fff;
  border: 2.5px solid #222;
  border-radius: 16px;
  box-shadow: none;
  padding: 24px 24px 18px 24px;
  min-width: 500px;
  max-width: 650px;
  flex: 1 1 0;
}
.storage-card.exact {
  min-width: 500px;
  max-width: 650px;
  background: #fff;
  border: 2.5px solid #222;
  border-radius: 16px;
  box-shadow: none;
  padding: 24px 24px 18px 24px;
  flex: 1 1 0;
}
.indirect-card.exact {
  min-width: 380px;
  max-width: 420px;
  background: #fcfcfa;
  border: 2px solid #e0e0e0;
}
.cost-card.exact h3 {
  font-size: 26px;
  color: #222;
  font-weight: 700;
  margin-bottom: 18px;
  text-align: left;
}
.cost-fields-horizontal {
  display: flex;
  flex-direction: row;
  gap: 18px;
  align-items: flex-end;
}
.cost-fields-horizontal > div {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 160px;
  margin-bottom: 0;
}
.cost-fields-horizontal label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
  text-align: left;
}
.cost-fields-horizontal input {
  font-size: 18px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1.5px solid #bbb;
  background: #fff;
  color: #333;
}
.cost-fields-horizontal.processing {
  flex-wrap: wrap;
  gap: 18px 24px;
}
.cost-fields-horizontal.processing > div {
  min-width: 220px;
  margin-bottom: 12px;
}
.cost-fields-horizontal.indirect {
  flex-wrap: wrap;
  gap: 18px 24px;
}
.cost-fields-horizontal.indirect > div {
  min-width: 180px;
  margin-bottom: 12px;
}
.admin-expense {
  flex-basis: 100%;
  min-width: 100%;
}
.admin-expense label {
  margin-top: 8px;
}
.summary-layout {
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
  margin: 40px 0 0 0;
}
.summary-table-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0 0 0 0;
  min-width: 520px;
  max-width: 600px;
  flex: 2;
}
.summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 18px;
}
.summary-table th, .summary-table td {
  border: 1px solid #e0e0e0;
  padding: 12px 18px;
  text-align: left;
  color: #222;
  background: #fff;
}
.summary-table th {
  background: #f5f5f5;
  font-weight: 700;
  font-size: 18px;
  color: #222;
}
.summary-table .total-row td {
  font-weight: 700;
  background: #f5f5f5;
  color: #222;
}
.summary-cards-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 220px;
  max-width: 260px;
  flex: 1;
}
.summary-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 2px solid #f0f0f0;
}
.summary-label {
  font-size: 16px;
  color: #888;
  margin-bottom: 6px;
}
.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: #444d39;
}
.save-btn {
  background: #444d39;
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 20px;
  padding: 12px 38px;
  font-weight: 500;
  box-shadow: 2px 4px 8px rgba(0,0,0,0.10);
  cursor: pointer;
  transition: background 0.2s;
}
.save-btn:hover {
  background: #2d3a2e;
}
.summary-table ::selection, .summary-table th::selection, .summary-table td::selection {
  background: #1976d2;
  color: #fff;
}
.success-banner {
  background: #b48c6e;
  color: #222;
  font-size: 22px;
  text-align: center;
  padding: 18px 0 8px 0;
  border-radius: 8px;
  margin: 18px auto 24px auto;
  max-width: 900px;
  font-weight: 700;
  border: 2px solid #7c624a;
}
.recommendations-block {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 18px 24px;
  min-width: 340px;
  max-width: 520px;
  flex: 1.2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 2px solid #f0f0f0;
}
.recommendations-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #222;
}
.recommendation {
  display: flex;
  align-items: center;
  font-size: 17px;
  margin-bottom: 14px;
  padding-left: 4px;
  font-weight: 500;
}
.recommendation .icon {
  font-size: 22px;
  margin-right: 10px;
  font-weight: bold;
}
.summary-cards-col.left {
  margin-right: 32px;
  min-width: 220px;
  max-width: 260px;
  flex: 1;
}
.summary-card .summary-value.big {
  font-size: 32px;
  font-weight: 700;
  color: #444d39;
}
.summary-flex-row {
  display: flex;
  flex-direction: row;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
  margin: 40px 0 0 0;
}
.actions-row.center {
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  display: flex;
}
</style> 